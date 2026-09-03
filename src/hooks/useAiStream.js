"use client";

import { useState, useCallback, useRef } from "react";

/**
 * Custom hook to consume Server-Sent Events (SSE) stream from /api/ai/chat/stream
 * Prevents UI freezing and delivers realtime progressive token rendering.
 */
export function useAiStream() {
  const [output, setOutput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState(null);
  const abortControllerRef = useRef(null);

  const stream = useCallback(async ({ message, history = [], onChunk, onDone, onError }) => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    setOutput("");
    setIsStreaming(true);
    setError(null);

    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

    try {
      const response = await fetch(`${apiUrl}/ai/chat/stream`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "text/event-stream",
          ...(token ? { "Authorization": `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ message, history }),
        signal: abortController.signal,
      });

      if (!response.ok) {
        const errJson = await response.json().catch(() => ({}));
        throw new Error(errJson.message || `HTTP error ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error("Browser does not support ReadableStream");
      }

      const decoder = new TextDecoder();
      let accumulated = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const dataStr = line.slice(6).trim();
            if (dataStr === "[DONE]") {
              break;
            }
            try {
              const parsed = JSON.parse(dataStr);
              if (parsed.error) {
                throw new Error(parsed.error);
              }
              if (parsed.text) {
                accumulated += parsed.text;
                setOutput(accumulated);
                if (onChunk) onChunk(parsed.text, accumulated);
              }
            } catch (jsonErr) {
              // Ignore partial or unparseable chunks
            }
          }
        }
      }

      if (onDone) onDone(accumulated);
      return accumulated;
    } catch (err) {
      if (err.name === "AbortError") {
        return;
      }
      const errMsg = err.message || "Gagal menghubungi AI stream";
      setError(errMsg);
      if (onError) onError(errMsg);
      throw err;
    } finally {
      setIsStreaming(false);
    }
  }, []);

  const stop = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setIsStreaming(false);
    }
  }, []);

  return {
    output,
    isStreaming,
    error,
    stream,
    stop,
  };
}

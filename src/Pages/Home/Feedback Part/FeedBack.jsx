import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { FaUserCircle, FaQuoteLeft, FaStar } from "react-icons/fa";
import { MdEmail } from "react-icons/md";

const SLOT_COUNT = 4;
const AUTOPLAY_MS = 6000;

const starRow = (n = 0) => {
  const full = Math.max(0, Math.min(5, Math.round(n)));
  return (
    <div className="flex items-center gap-0.5" aria-label={`Rating ${full} of 5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <FaStar
          key={i}
          className={i < full ? "text-yellow-400" : "text-slate-300"}
        />
      ))}
    </div>
  );
};

/** Card shell: fixed layout; inner content animates so the grid never moves */
function CardSlot({ itemKey, children }) {
  return (
    <div
      className="
        relative rounded-2xl border border-slate-200/70 bg-white/80
        shadow-sm backdrop-blur-sm p-6 min-h-[220px]
        hover:shadow-md transition-shadow duration-300
        overflow-hidden
      "
    >
      {/* soft radial wash */}
      <div className="pointer-events-none absolute -right-10 -bottom-10 h-40 w-40 rounded-full bg-indigo-400/10 blur-2xl" />
      <AnimatePresence mode="wait">
        <motion.div
          key={itemKey}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0, transition: { duration: 0.35 } }}
          exit={{ opacity: 0, y: -12, transition: { duration: 0.3 } }}
          className="relative"
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export default function FeedBack() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [index, setIndex] = useState(0); // start of the window
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    let alive = true;
    axios
      .get("https://b11a12-server-side-sajjadjim.vercel.app/feedbacks/top/10")
      .then((res) => {
        if (!alive) return;
        const data = Array.isArray(res.data) ? res.data : [];
        setFeedbacks(data);
        setIndex(0);
      })
      .catch((err) => console.error("Fetch failed:", err));
    return () => {
      alive = false;
    };
  }, []);

  const canCarousel = feedbacks.length > SLOT_COUNT;

  // autoplay only when we have more than 4
  useEffect(() => {
    if (!canCarousel || paused) return;
    const t = setInterval(() => {
      setIndex((prev) => (prev + SLOT_COUNT) % feedbacks.length);
    }, AUTOPLAY_MS);
    return () => clearInterval(t);
  }, [canCarousel, paused, feedbacks.length]);

  const slots = useMemo(() => {
    const out = [];
    const len = feedbacks.length;
    if (len === 0) return out;

    // If len <= SLOT_COUNT, just show the first len without modulo steps
    if (!canCarousel) {
      for (let s = 0; s < Math.min(SLOT_COUNT, len); s++) {
        out.push(feedbacks[s]);
      }
      return out;
    }

    // carousel window of 4 using modulo
    for (let s = 0; s < SLOT_COUNT; s++) {
      const idx = (index + s) % len;
      out.push(feedbacks[idx]);
    }
    return out;
  }, [feedbacks, index, canCarousel]);

  const next = () => {
    if (!canCarousel) return;
    setIndex((p) => (p + SLOT_COUNT) % feedbacks.length);
  };
  const prev = () => {
    if (!canCarousel) return;
    setIndex((p) => (p - SLOT_COUNT + feedbacks.length) % feedbacks.length);
  };

  return (
    <section
      className="relative 2xl:max-w-7xl md:max-w-6xl mx-auto py-12"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Header */}
      <div className="text-center">
        <h1 className="text-2xl md:text-4xl font-bold text-indigo-700">
          What Our Users Say 💬
        </h1>
        <p className="mt-2 text-slate-600">
          Real feedback from Medical BootCamps participants.
        </p>
      </div>

      {/* Controls */}
      {canCarousel && (
        <div className="mt-6 flex items-center justify-end gap-2">
          <button
            onClick={prev}
            className="rounded-xl border px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50"
            aria-label="Previous"
          >
            Prev
          </button>
          <button
            onClick={next}
            className="rounded-xl bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-indigo-700"
            aria-label="Next"
          >
            Next
          </button>
        </div>
      )}

      {/* Grid (stays fixed); inner content of each card animates */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {slots.length === 0 &&
          Array.from({ length: SLOT_COUNT }).map((_, i) => (
            <div
              key={`skeleton-${i}`}
              className="rounded-2xl border border-slate-200/70 bg-white/60 p-6 min-h-[220px] animate-pulse"
            >
              <div className="h-4 w-2/3 bg-slate-200 rounded" />
              <div className="mt-3 h-3 w-full bg-slate-200 rounded" />
              <div className="mt-2 h-3 w-5/6 bg-slate-200 rounded" />
              <div className="mt-6 h-6 w-24 bg-slate-200 rounded-full" />
            </div>
          ))}

        {slots.map((item, slotIdx) => (
          <CardSlot key={item?._id || `slot-${slotIdx}`} itemKey={item?._id}>
            {/* Top identity row */}
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="absolute -inset-1 rounded-full bg-indigo-200/40 blur-md" />
                <FaUserCircle className="relative z-10 h-9 w-9 text-indigo-600" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-slate-900">
                  {item?.participantName || "Anonymous"}
                </h3>
                <div className="flex items-center gap-1 text-xs text-slate-500">
                  <MdEmail className="text-slate-400" />
                  <span className="truncate max-w-[160px]">
                    {item?.participantEmail || "hidden@email.com"}
                  </span>
                </div>
              </div>
            </div>

            {/* Quote */}
            <div className="relative mt-3 pl-6">
              <FaQuoteLeft className="absolute left-0 top-1 text-indigo-300" />
              <p className="text-sm leading-relaxed text-slate-700">
                {item?.feedback || "No feedback provided."}
              </p>
            </div>

            {/* Footer row */}
            <div className="mt-5 flex items-center justify-between">
              <span className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1">
                {starRow(item?.rating ?? 0)}
                <span className="text-xs font-medium text-indigo-700">
                  {Math.round(item?.rating ?? 0)}/5
                </span>
              </span>
              <span className="text-[11px] font-medium text-slate-400">
                #Feedback
              </span>
            </div>
          </CardSlot>
        ))}
      </div>

      {/* Dots */}
      {canCarousel && (
        <div className="mt-6 flex justify-center gap-2">
          {Array.from({
            length: Math.ceil(feedbacks.length / SLOT_COUNT),
          }).map((_, i) => {
            const activeGroup = Math.floor(index / SLOT_COUNT);
            const isActive = i === activeGroup;
            return (
              <button
                key={i}
                onClick={() => setIndex(i * SLOT_COUNT)}
                className={`h-2.5 w-2.5 rounded-full transition-all ${
                  isActive ? "bg-indigo-600 w-6" : "bg-slate-300 hover:bg-slate-400"
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            );
          })}
        </div>
      )}
    </section>
  );
}

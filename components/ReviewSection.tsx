"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { api } from "@/lib/api";

export function ReviewSection({ basketId, reviews }: { basketId: string; reviews: any[] }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [items, setItems] = useState(reviews);

  async function submit() {
    const { data } = await api.post(`/review/${basketId}`, { rating, comment });
    setItems([data.review, ...items.filter((item) => item._id !== data.review._id)]);
    setComment("");
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-3 md:grid-cols-[160px_1fr_auto]">
        <select className="field" value={rating} onChange={(e) => setRating(Number(e.target.value))}>
          {[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{n} stars</option>)}
        </select>
        <input className="field" value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Review this basket" />
        <button className="btn btn-primary" onClick={submit}>Post</button>
      </div>
      {items.map((review) => (
        <div key={review._id} className="rounded-lg border border-line p-3">
          <div className="flex items-center gap-1 font-bold"><Star size={15} /> {review.rating}</div>
          <p className="mt-1 text-sm text-gray-600">{review.comment}</p>
        </div>
      ))}
    </div>
  );
}

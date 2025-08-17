import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import dayjs from "dayjs";
import { useParams, Link } from "react-router"; // keep your current router import
import useAuth from "../../Hook/useAuth";
import {
  Calendar,
  MapPin,
  Banknote,
  Stethoscope,
  Users,
  Info,
  Share2,
  Copy,
} from "lucide-react";

const Skeleton = () => (
  <section className="py-10 px-4 max-w-4xl mx-auto">
    <div className="mt-20 rounded-xl overflow-hidden shadow-xl border border-indigo-50">
      <div className="h-64 w-full bg-gray-200 animate-pulse" />
      <div className="p-6 space-y-3">
        <div className="h-7 w-2/3 bg-gray-200 rounded animate-pulse" />
        <div className="h-4 w-40 bg-gray-200 rounded animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-4 w-full bg-gray-200 rounded animate-pulse" />
          ))}
        </div>
        <div className="h-10 w-40 bg-gray-200 rounded animate-pulse" />
      </div>
    </div>
  </section>
);

const Badge = ({ children, color = "indigo" }) => {
  const palette = {
    indigo: "bg-indigo-50 text-indigo-700 border-indigo-200",
    green: "bg-emerald-50 text-emerald-700 border-emerald-200",
    red: "bg-rose-50 text-rose-700 border-rose-200",
    amber: "bg-amber-50 text-amber-700 border-amber-200",
    gray: "bg-gray-50 text-gray-700 border-gray-200",
  };
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs border ${palette[color]}`}>
      {children}
    </span>
  );
};

const CampDetails = () => {
  const campId = useParams(); // { id: "..." }
  const [camp, setCamp] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copyOK, setCopyOK] = useState(false);
  const { user } = useAuth();
  const accessToken = user?.accessToken;

  useEffect(() => {
    let mounted = true;
    const fetchCamp = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `https://b11a12-server-side-sajjadjim.vercel.app/camps/${campId.id}`,
          accessToken
            ? { headers: { authorization: `Bearer ${accessToken}` } }
            : undefined
        );
        if (mounted) setCamp(res.data);
      } catch (err) {
        console.error("Failed to fetch camp details", err);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchCamp();
    return () => {
      mounted = false;
    };
  }, [campId.id, accessToken]);

  // derived
  const isExpired = useMemo(
    () => (camp ? dayjs(camp.dateTime).isBefore(dayjs()) : false),
    [camp]
  );

  const feeBDT = useMemo(
    () => (camp ? `৳${Number(camp.campFees || 0).toLocaleString()}` : "৳0"),
    [camp]
  );

  const spotsLeft = useMemo(() => {
    if (!camp) return 0;
    // If you have capacity/registered fields, compute accurately. Fallback:
    // assuming totalParticipant = capacity; you can tweak to your schema.
    return Math.max(0, Number(camp.totalParticipant || 0));
  }, [camp]);

  const shareLink = typeof window !== "undefined" ? window.location.href : "";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareLink);
      setCopyOK(true);
      setTimeout(() => setCopyOK(false), 1200);
    } catch {}
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: camp?.campName || "MCMS Bootcamp",
          text: "Check out this bootcamp on MCMS",
          url: shareLink,
        });
      } catch {}
    } else {
      handleCopy();
    }
  };

  if (loading) return <Skeleton />;

  if (!camp) {
    return (
      <section className="py-10 px-4 max-w-4xl mx-auto">
        <div className="mt-20 rounded-xl border border-rose-100 bg-rose-50 text-rose-700 p-6">
          Unable to load this camp right now. Please try again later.
        </div>
      </section>
    );
  }

  return (
    <section className="py-10 px-4 max-w-4xl mx-auto">
      <div className="bg-white/90 backdrop-blur shadow-xl border border-indigo-50 mt-20 rounded-xl overflow-hidden relative">
        {/* top image */}
        <div className="relative">
          <img
            src={camp.image}
            alt={camp.campName}
            className="w-full h-64 object-cover transition-transform duration-300 hover:scale-[1.02]"
            onError={(e) => (e.currentTarget.style.display = "none")}
          />
          {/* status ribbons */}
          <div className="absolute top-4 left-4 flex gap-2">
            {isExpired ? (
              <Badge color="red">Expired</Badge>
            ) : (
              <Badge color="green">Open</Badge>
            )}
            {spotsLeft > 0 ? (
              <Badge color="amber">{spotsLeft} spot(s) left</Badge>
            ) : (
              <Badge color="gray">Limited</Badge>
            )}
          </div>

          {/* share/copy */}
          <div className="absolute top-4 right-4 flex gap-2">
            <button
              onClick={handleShare}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/90 text-indigo-700 border border-indigo-100 shadow hover:bg-white transition"
              title="Share"
            >
              <Share2 size={16} /> Share
            </button>
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/90 text-indigo-700 border border-indigo-100 shadow hover:bg-white transition"
              title="Copy link"
            >
              <Copy size={16} /> {copyOK ? "Copied!" : "Copy"}
            </button>
          </div>
        </div>

        {/* body */}
        <div className="p-6">
          <h1 className="text-3xl font-bold mb-2 tracking-tight">{camp.campName}</h1>

          <div className="flex flex-wrap items-center gap-2 mb-4 text-gray-600">
            <span className="inline-flex items-center gap-2">
              <Calendar size={18} className="text-indigo-600" />
              {dayjs(camp.dateTime).format("MMMM D, YYYY h:mm A")}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
            <div className="space-y-2 text-gray-800">
              <p className="flex items-center gap-2">
                <Banknote size={18} className="text-indigo-600" />
                <span className="font-semibold">Fees:</span> {feeBDT}
              </p>
              <p className="flex items-center gap-2">
                <MapPin size={18} className="text-indigo-600" />
                <span className="font-semibold">Location:</span> {camp.location}
              </p>
              <p className="flex items-center gap-2">
                <Stethoscope size={18} className="text-indigo-600" />
                <span className="font-semibold">Healthcare Professional:</span>{" "}
                {camp.healthcareProfessional}
              </p>
            </div>

            <div className="space-y-2 text-gray-800">
              <p className="flex items-center gap-2">
                <Users size={18} className="text-indigo-600" />
                <span className="font-semibold">Total Participants:</span>{" "}
                {camp.totalParticipant}
              </p>
              <p className="flex items-start gap-2 text-gray-700">
                <Info size={18} className="text-indigo-600 mt-0.5" />
                <span className="leading-relaxed">{camp.description}</span>
              </p>
            </div>
          </div>

          {/* CTA */}
          {isExpired ? (
            <button
              className="mt-4 px-6 py-2 bg-rose-500 text-white rounded-lg cursor-not-allowed"
              disabled
            >
              Unavailable (Expired)
            </button>
          ) : (
            <Link
              to={`/registration/${campId.id}`}
              className="inline-flex items-center gap-2 mt-2 px-6 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 active:scale-[0.98] transition"
            >
              Join Now
            </Link>
          )}
        </div>
      </div>

      {/* Optional mini-map / location embed */}
      {camp.location && (
        <div className="mt-6 rounded-xl overflow-hidden bg-white/90 border border-indigo-50 shadow">
          <iframe
            title="Camp Location"
            className="w-full h-64"
            loading="lazy"
            src={`https://www.google.com/maps?q=${encodeURIComponent(camp.location)}&output=embed`}
          />
        </div>
      )}
    </section>
  );
};

export default CampDetails;

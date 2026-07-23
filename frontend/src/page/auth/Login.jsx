import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import carImage from "../../assets/car.png";

const Login = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="min-h-screen bg-slate-100 px-4 py-10 sm:px-6 lg:px-12"
    >
      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1.15fr_0.85fr] items-center">
        <section className="overflow-hidden rounded-[2rem] bg-white p-8 shadow-2xl shadow-slate-200/60 sm:p-10">
          <div className="mb-10">
            <div className="inline-flex items-center gap-3 rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-sky-500 text-white">
                i
              </span>
              i-Share — Rent. Share. Save.
            </div>
            <h1 className="mt-8 text-4xl font-extrabold text-slate-950 sm:text-5xl">
              Welcome Back
            </h1>
            <p className="mt-4 max-w-xl text-sm text-slate-500 sm:text-base">
              Login to your account and manage vehicles, reservations, and
              rental workflows from one place.
            </p>
          </div>

          <form className="grid gap-6">
            <label className="block text-sm font-semibold text-slate-700">
              Email or Phone
            </label>
            <input
              type="text"
              placeholder="example@email.com"
              className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-5 py-4 text-sm text-slate-900 shadow-sm outline-none transition focus:border-slate-300 focus:ring-2 focus:ring-slate-200"
            />

            <label className="block text-sm font-semibold text-slate-700">
              Password
            </label>
            <input
              type="password"
              placeholder="Enter your password"
              className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-5 py-4 text-sm text-slate-900 shadow-sm outline-none transition focus:border-slate-300 focus:ring-2 focus:ring-slate-200"
            />

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <label className="flex items-center gap-2 text-sm text-slate-600">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                />
                Remember me
              </label>
              <Link
                className="text-sm font-semibold text-sky-600 hover:text-sky-700"
                to="/forgot-password"
              >
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              className="mt-2 rounded-3xl bg-linear-to-r from-sky-600 to-blue-600 px-6 py-4 text-base font-semibold text-white shadow-xl shadow-sky-500/20 transition hover:-translate-y-0.5 hover:shadow-2xl"
            >
              Login
            </button>
          </form>

          <div className="mt-8 border-t border-slate-200 pt-6 text-center text-sm text-slate-500">
            or continue with
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <button className="flex items-center justify-center gap-2 rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-300">
              <span className="text-2xl">G</span>
              Google
            </button>
            <button className="flex items-center justify-center gap-2 rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-300">
              <span className="text-2xl"></span>
              Apple
            </button>
            <button className="flex items-center justify-center gap-2 rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-300">
              <span className="text-2xl">f</span>
              Facebook
            </button>
          </div>
        </section>

        <section className="relative overflow-hidden rounded-[2rem] bg-linear-to-br from-sky-500 via-slate-950 to-slate-950 p-8 text-white shadow-2xl shadow-slate-950/20 sm:p-10">
          <div className="absolute inset-x-0 top-0 h-1/2 bg-white/10 blur-3xl" />
          <div className="flex h-full flex-col justify-between gap-8">
            <div className="space-y-4">
              <p className="inline-flex rounded-full bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-slate-100">
                Heavy Equipment
              </p>
              <h2 className="text-4xl font-extrabold leading-tight sm:text-5xl">
                Drive revenue with every rental
              </h2>
              <p className="max-w-xl text-sm text-slate-200/90 sm:text-base">
                Discover the smarter fleet experience with local asset
                protection, fast bookings, and an easy customer dashboard.
              </p>
            </div>

            <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/10 p-6 backdrop-blur-xl">
              <div className="absolute right-4 top-4 h-16 w-16 rounded-full bg-sky-400/20 blur-2xl" />
              <img
                src={carImage}
                alt="Car asset"
                className="mx-auto w-full max-w-[320px] object-contain"
              />
              <div className="mt-8 rounded-3xl bg-slate-950/80 p-5">
                <p className="text-xs uppercase tracking-[0.28em] text-slate-300">
                  Titan Heavy Rentals
                </p>
                <div className="mt-3 flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.28em] text-slate-400">
                      Daily Rate
                    </p>
                    <p className="mt-2 text-2xl font-semibold text-white">
                      $320/day
                    </p>
                  </div>
                  <button className="rounded-full bg-emerald-400 px-5 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-emerald-400/30 transition hover:bg-emerald-300">
                    Book Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </motion.div>
  );
};

export default Login;

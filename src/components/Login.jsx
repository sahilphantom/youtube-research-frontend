"use client"

import { useState } from "react"
import { useNavigate, useLocation, Link } from "react-router-dom"
import { useAuth } from "../context/AuthContext" // Assuming this path is correct in your project
import api from "../services/api" // Assuming this path is correct in your project
import { motion } from "framer-motion"

export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    try {
      const response = await api.post("/auth/login", { email, password })
      await login(response.data.token)

      // Navigate to the redirect path or dashboard
      const redirectPath = location.state?.from?.pathname || "/dashboard"
      navigate(redirectPath, { replace: true })
    } catch (err) {
      setError(err.response?.data?.message || "ログインに失敗しました")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center  p-4">
      <motion.div
        className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md border border-purple-100"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-3xl font-bold text-center mb-8 text-indigo-800">ログイン</h2>

        {error && (
          <motion.div
            className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg mb-6 text-center"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {error}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">メールアドレス</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 ease-in-out"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">パスワード</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 ease-in-out"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 px-4 rounded-lg text-white font-semibold text-lg transition duration-300 ease-in-out ${
              loading
                ? "bg-indigo-400 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700 shadow-md hover:shadow-lg"
            }`}
          >
            {loading ? "ログイン中..." : "ログイン"}
          </button>
        </form>
        <p className="mt-6 text-center text-gray-600">
          アカウントをお持ちではありませんか？{" "}
          <Link
            to="/register"
            className="text-purple-600 hover:text-purple-800 font-medium transition duration-200 ease-in-out"
          >
            登録
          </Link>
        </p>
      </motion.div>
    </div>
  )
}

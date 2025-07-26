"use client"

import { useState } from "react"
import { Link, useNavigate, Navigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext" // Assuming this path is correct
import { motion } from "framer-motion"

export default function Register() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { signup, isAuthenticated } = useAuth()
  const navigate = useNavigate()

  // Redirect if already authenticated
  if (isAuthenticated) {
    return <Navigate to="/" replace />
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError("パスワードが一致しません")
      return
    }
    setIsLoading(true)
    try {
      await signup({
        email: formData.email,
        password: formData.password,
      })
      // Assuming successful signup navigates to login or dashboard
      navigate("/login", { replace: true }) // Or '/dashboard'
    } catch (err) {
      setError(err.response?.data?.message || "登録中にエラーが発生しました")
      console.error("Registration error:", err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center  p-4">
      <motion.div
        className="max-w-md w-full p-8 bg-white rounded-xl shadow-2xl border border-purple-100"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-indigo-800">アカウントを作成</h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            または{" "}
            <Link to="/login" className="font-medium text-purple-600 hover:text-purple-800 transition duration-200">
              アカウントにサインイン
            </Link>
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <motion.div
              className="rounded-md bg-red-50 border border-red-200 p-4 text-center"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="text-sm text-red-700">{error}</div>
            </motion.div>
          )}
          <div className="rounded-lg shadow-sm border border-purple-300 overflow-hidden">
            <div>
              <label htmlFor="email" className="sr-only">
                メールアドレス
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="block w-full px-4 py-3 border-0 border-b border-purple-200 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-200 ease-in-out"
                placeholder="メールアドレス"
                value={formData.email}
                onChange={handleChange}
                disabled={isLoading}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                パスワード
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                className="block w-full px-4 py-3 border-0 border-b border-purple-200 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-200 ease-in-out"
                placeholder="パスワード"
                value={formData.password}
                onChange={handleChange}
                disabled={isLoading}
              />
            </div>
            <div>
              <label htmlFor="confirmPassword" className="sr-only">
                パスワードの確認
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                className="block w-full px-4 py-3 border-0 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-200 ease-in-out"
                placeholder="パスワードの確認"
                value={formData.confirmPassword}
                onChange={handleChange}
                disabled={isLoading}
              />
            </div>
          </div>
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-lg font-medium rounded-md text-white transition duration-300 ease-in-out ${
                isLoading
                  ? "bg-indigo-400 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700 shadow-md hover:shadow-lg"
              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
            >
              {isLoading ? (
                <span className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  アカウント作成中...
                </span>
              ) : (
                "アカウントを作成"
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}

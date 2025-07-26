
import { Button } from "./ui/Button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/Card"
import { Input } from "./ui/Input"
import { Textarea } from "./ui/TextArea"
import { motion } from "framer-motion"

export function Contact() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, delay: 0.2 }}
    >
      <Card className="w-full max-w-md mx-auto border-purple-200 shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl text-indigo-800">メッセージを送る</CardTitle>
          <CardDescription className="text-gray-600">
            以下のフォームにご記入いただければ、できるだけ早くご連絡いたします。
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="grid gap-4">
            <div className="grid gap-2">
              <label htmlFor="name" className="text-sm font-medium text-gray-700">
                お名前
              </label>
              <Input
                id="name"
                placeholder="お名前"
                className="border-purple-300 focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="email" className="text-sm font-medium text-gray-700">
                メールアドレス
              </label>
              <Input
                id="email"
                type="email"
                placeholder="あなたのメールアドレス"
                className="border-purple-300 focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="subject" className="text-sm font-medium text-gray-700">
                件名
              </label>
              <Input
                id="subject"
                placeholder="メッセージの件名"
                className="border-purple-300 focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="message" className="text-sm font-medium text-gray-700">
                メッセージ
              </label>
              <Textarea
                id="message"
                placeholder="ここにメッセージを入力..."
                className="min-h-[120px] border-purple-300 focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white">
              メッセージを送信
            </Button>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  )
}

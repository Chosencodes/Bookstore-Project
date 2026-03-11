"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function Newsletter() {
  const [email, setEmail] = useState("")
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      setSubmitted(true)
      setEmail("")
    }
  }

  return (
    <section className="py-16 bg-secondary/50">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-foreground">Join the community</h2>
        <p className="mt-4 text-muted-foreground">
          Enter your email address to receive regular updates, as well as news on upcoming events and specific offers.
        </p>
        
        {submitted ? (
          <p className="mt-8 text-primary font-medium">Thank you for subscribing!</p>
        ) : (
          <form onSubmit={handleSubmit} className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="max-w-sm bg-background"
              required
            />
            <Button type="submit">Subscribe</Button>
          </form>
        )}
      </div>
    </section>
  )
}

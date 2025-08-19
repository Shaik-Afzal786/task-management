import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Clock, Kanban, ListChecks, PieChart } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center justify-between">
          <div className="flex items-center gap-2 font-semibold">
            <Kanban className="h-5 w-5" />
            <span>TaskMaster Pro</span>
          </div>
          <div className="flex items-center gap-4">
            <nav className="hidden md:flex gap-6">
              <Link href="#features" className="text-sm font-medium transition-colors hover:text-primary">
                Features
              </Link>
              <Link href="#testimonials" className="text-sm font-medium transition-colors hover:text-primary">
                Testimonials
              </Link>
              <Link href="#pricing" className="text-sm font-medium transition-colors hover:text-primary">
                Pricing
              </Link>
            </nav>
            <ThemeToggle />
            <div className="hidden md:flex gap-2">
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Log in
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm">Sign up</Button>
              </Link>
            </div>
            <Button variant="ghost" size="icon" className="md:hidden">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5"
              >
                <line x1="4" x2="20" y1="12" y2="12" />
                <line x1="4" x2="20" y1="6" y2="6" />
                <line x1="4" x2="20" y1="18" y2="18" />
              </svg>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    Manage tasks with precision and ease
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    TaskMaster Pro helps you organize your work, prioritize tasks, and track progress—all in one secure,
                    local application.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href="/register">
                    <Button size="lg" className="group">
                      Get Started
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1"
                      >
                        <line x1="5" x2="19" y1="12" y2="12" />
                        <polyline points="12 5 19 12 12 19" />
                      </svg>
                    </Button>
                  </Link>
                  <Link href="/demo">
                    <Button size="lg" variant="outline">
                      Try Demo
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="relative h-[350px] w-full overflow-hidden rounded-xl border bg-background p-4 shadow-xl sm:h-[400px] lg:h-[500px]">
                  <div className="flex h-full flex-col space-y-4 overflow-hidden rounded-lg bg-muted/50 p-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <h3 className="text-xl font-semibold">My Tasks</h3>
                        <p className="text-sm text-muted-foreground">Manage your daily workflow</p>
                      </div>
                      <Button size="sm">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="mr-2 h-4 w-4"
                        >
                          <line x1="12" x2="12" y1="5" y2="19" />
                          <line x1="5" x2="19" y1="12" y2="12" />
                        </svg>
                        Add Task
                      </Button>
                    </div>
                    <div className="flex-1 space-y-4 overflow-auto">
                      <Card className="border border-muted-foreground/20">
                        <CardContent className="p-3">
                          <div className="flex items-start justify-between">
                            <div className="flex items-start gap-3">
                              <div className="mt-0.5">
                                <Clock className="h-4 w-4 text-blue-500" />
                              </div>
                              <div>
                                <h4 className="font-medium">Finalize project proposal</h4>
                                <p className="text-xs text-muted-foreground mt-1">Due today at 5:00 PM</p>
                                <div className="flex items-center gap-2 mt-2">
                                  <span className="rounded-full bg-red-500/15 px-2 py-0.5 text-xs font-medium text-red-700 dark:text-red-400">
                                    High
                                  </span>
                                  <span className="rounded-full bg-purple-500/15 px-2 py-0.5 text-xs font-medium text-purple-700 dark:text-purple-400">
                                    Work
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="border border-muted-foreground/20">
                        <CardContent className="p-3">
                          <div className="flex items-start justify-between">
                            <div className="flex items-start gap-3">
                              <div className="mt-0.5">
                                <CheckCircle className="h-4 w-4 text-green-500" />
                              </div>
                              <div>
                                <h4 className="font-medium">Review client feedback</h4>
                                <p className="text-xs text-muted-foreground mt-1">Completed yesterday</p>
                                <div className="flex items-center gap-2 mt-2">
                                  <span className="rounded-full bg-blue-500/15 px-2 py-0.5 text-xs font-medium text-blue-700 dark:text-blue-400">
                                    Medium
                                  </span>
                                  <span className="rounded-full bg-purple-500/15 px-2 py-0.5 text-xs font-medium text-purple-700 dark:text-purple-400">
                                    Work
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="border border-muted-foreground/20">
                        <CardContent className="p-3">
                          <div className="flex items-start justify-between">
                            <div className="flex items-start gap-3">
                              <div className="mt-0.5">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="24"
                                  height="24"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  className="h-4 w-4 text-muted-foreground"
                                >
                                  <circle cx="12" cy="12" r="10" />
                                </svg>
                              </div>
                              <div>
                                <h4 className="font-medium">Update documentation</h4>
                                <p className="text-xs text-muted-foreground mt-1">Due in 3 days</p>
                                <div className="flex items-center gap-2 mt-2">
                                  <span className="rounded-full bg-green-500/15 px-2 py-0.5 text-xs font-medium text-green-700 dark:text-green-400">
                                    Low
                                  </span>
                                  <span className="rounded-full bg-orange-500/15 px-2 py-0.5 text-xs font-medium text-orange-700 dark:text-orange-400">
                                    Documentation
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-muted/40">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">Key Features</div>
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                  Everything you need to stay organized
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  TaskMaster Pro combines powerful task management with a beautiful interface, all while keeping your
                  data secure and local.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3 lg:gap-12">
              <div className="flex flex-col justify-center space-y-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 dark:bg-primary/20">
                  <ListChecks className="h-6 w-6 text-primary" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">Task Organization</h3>
                  <p className="text-muted-foreground">
                    Create, categorize, and prioritize tasks with intuitive controls and flexible organization options.
                  </p>
                </div>
              </div>
              <div className="flex flex-col justify-center space-y-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 dark:bg-primary/20">
                  <Kanban className="h-6 w-6 text-primary" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">Multiple Views</h3>
                  <p className="text-muted-foreground">
                    Switch between list, board, and calendar views to visualize your tasks in different ways.
                  </p>
                </div>
              </div>
              <div className="flex flex-col justify-center space-y-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 dark:bg-primary/20">
                  <PieChart className="h-6 w-6 text-primary" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">Progress Tracking</h3>
                  <p className="text-muted-foreground">
                    Monitor your productivity with visual progress indicators and detailed analytics.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="testimonials" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">Testimonials</div>
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                  Loved by professionals everywhere
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  See what our users have to say about TaskMaster Pro
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-2 lg:gap-12">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="font-semibold text-primary">JD</span>
                    </div>
                    <div>
                      <CardTitle className="text-lg">Jane Doe</CardTitle>
                      <CardDescription>Product Manager</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    "TaskMaster Pro has completely transformed how I manage my team's projects. The intuitive interface
                    and powerful organization tools have boosted our productivity by at least 30%."
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="font-semibold text-primary">JS</span>
                    </div>
                    <div>
                      <CardTitle className="text-lg">John Smith</CardTitle>
                      <CardDescription>Freelance Developer</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    "As someone who values privacy, I love that TaskMaster Pro keeps all my data local. The interface is
                    beautiful and the customization options let me work exactly how I want."
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section id="pricing" className="w-full py-12 md:py-24 lg:py-32 bg-muted/40">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">Pricing</div>
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">Simple, transparent pricing</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  TaskMaster Pro is completely free to use, with no hidden fees or subscriptions
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-md items-start gap-6 py-12">
              <Card className="w-full">
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl">Free Forever</CardTitle>
                  <div className="flex justify-center">
                    <div className="text-4xl font-bold">$0</div>
                  </div>
                  <CardDescription>All features included</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4 text-center">
                  <div className="flex items-center justify-center gap-1">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    <span>Unlimited tasks and projects</span>
                  </div>
                  <div className="flex items-center justify-center gap-1">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    <span>Multiple view options</span>
                  </div>
                  <div className="flex items-center justify-center gap-1">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    <span>Task categorization and tagging</span>
                  </div>
                  <div className="flex items-center justify-center gap-1">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    <span>Progress tracking and analytics</span>
                  </div>
                  <div className="flex items-center justify-center gap-1">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    <span>Secure local storage</span>
                  </div>
                  <div className="flex items-center justify-center gap-1">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    <span>Data export and backup</span>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" asChild>
                    <Link href="/register">Get Started</Link>
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 border-t">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                  Ready to transform your productivity?
                </h2>
                <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Join thousands of professionals who trust TaskMaster Pro to organize their work and life.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link href="/register">
                  <Button size="lg" className="group">
                    Get Started for Free
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1"
                    >
                      <line x1="5" x2="19" y1="12" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="w-full border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            © {new Date().getFullYear()} TaskMaster Pro. All rights reserved.
          </p>
          <div className="flex gap-4">
            <Link href="/privacy" className="text-sm text-muted-foreground underline-offset-4 hover:underline">
              Privacy
            </Link>
            <Link href="/terms" className="text-sm text-muted-foreground underline-offset-4 hover:underline">
              Terms
            </Link>
            <Link href="/contact" className="text-sm text-muted-foreground underline-offset-4 hover:underline">
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

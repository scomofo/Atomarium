import { createFileRoute } from "@tanstack/react-router";
import { Course } from "@/components/course";

export const Route = createFileRoute("/")({ component: Course });

"use client"

import * as React from "react"
import { CalendarIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

const futureTime = (() => {
  const now = new Date();
  now.setMinutes(now.getMinutes() + 1);
  return now.toTimeString().slice(0, 8);
})()

export function TimePicker({dateName, timeName, dateRequired, timeRequired}: {dateName?: string; timeName?: string, dateRequired?: boolean; timeRequired?: boolean}) {
  const [open, setOpen] = React.useState(false)
  const [date, setDate] = React.useState<Date | undefined>(undefined)

  return (
    <div className="flex gap-4">
      <div className="flex flex-col gap-3">
        <Label htmlFor="date" className="px-1">
          Subscription Date
        </Label>
        <div className="relative flex">
          <div className="w-0 overflow-hidden">
            <Input
              id="date"
              type="date"
              name={dateName}
              required={dateRequired}
              value={date ? date.toISOString().slice(0, 10) : ""}
              className="bg-background pr-10"
              onChange={() => {}}
              onKeyDown={(e) => {
                if (e.key === "ArrowDown") {
                  e.preventDefault()
                  setOpen(true)
                }
              }}
            />
          </div>
          <Input
            type="text"
            value={date ? date.toLocaleDateString() : ""}
            readOnly
            className="bg-background pr-10"
            placeholder="Select date"
            onClick={() => setOpen(true)}
            onKeyDown={(e) => {
              if (e.key === "ArrowDown") {
                e.preventDefault()
                setOpen(true)
              }
            }}
            onChange={() => {}}
          />
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                id="date-picker"
                variant="ghost"
                className="absolute top-1/2 right-2 size-6 -translate-y-1/2"
              >
                <CalendarIcon className="size-3.5" />
                <span className="sr-only">Select date</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-auto overflow-hidden p-0"
              align="end"
              alignOffset={-8}
              sideOffset={10}
            >
              <Calendar
                mode="single"
                hidden={{
                  before: new Date(),
                }}
                selected={date}
                captionLayout="dropdown"
                onSelect={(selectedDate) => {
                  setDate(selectedDate)
                  setOpen(false)
                }}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
      <div className="flex flex-col gap-3">
        <Label htmlFor="time" className="px-1">
          Time
        </Label>
        <Input
          type="time"
          id="time"
          name={timeName}
          required={timeRequired}
          step="1"
          className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
          min={futureTime}
        />
      </div>
    </div>
  )
}

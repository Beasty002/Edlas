"use client";

import React, { useState } from "react";
import { Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

const FormDatePicker = ({
  name,
  label,
  control,
  rules = {},
  placeholder = "Select date",
}) => {
  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({ field, fieldState: { error } }) => {
        const [open, setOpen] = useState(false);
        const selectedDate = field.value ? new Date(field.value) : undefined;

        return (
          <div className="flex flex-col gap-1">
            <Label>{label}</Label>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Input
                  {...field}
                  readOnly
                  value={field.value}
                  placeholder={placeholder}
                  className="pr-10 w-full"
                  onClick={() => setOpen(true)}
                />
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => {
                    if (date) {
                      field.onChange(date.toISOString().split("T")[0]);
                      setOpen(false);
                    }
                  }}
                />
              </PopoverContent>
            </Popover>
            {error && (
              <p className="text-red-500 text-sm mt-1">{error.message}</p>
            )}
          </div>
        );
      }}
    />
  );
};

export default FormDatePicker;

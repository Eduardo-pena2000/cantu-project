"use client";

import { useState } from "react";
import { Check, ChevronsUpDown, Loader, RotateCcw, TriangleAlert } from "lucide-react";

import { cn } from "@/lib/utils";
import { useAsyncSelect } from "@/hooks/use-async-select";

import {
  Command,
  CommandEmpty,
  CommandError,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandLoading,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export function AsyncSelect({
  modal = false,
  disabled = false,
  optionsKey,
  value,
  initialInputValue = undefined,
  searchLabel = "Buscar...",
  inputLabel = "Selecciona una opción.",
  dtoFn,
  getOptions,
  onValueChange,
  loadingOptionsLabel = "Cargando...",
  noOptionsLabel = "No se encontraron resultados.",
}) {
  const [open, setOpen] = useState(false);
  const {
    lastElementRef,
    isLoading,
    error,
    data: options,
    handleSearch,
    clearSearch,
    retryFetch,
  } = useAsyncSelect({
    optionsKey,
    queryFn: getOptions,
    dtoFn,
    enabled: open,
  });

  const selectedOption = value ? options.find((option) => option.value === value)?.label : null;

  function onSelect(newValue) {
    if (newValue !== value) {
      onValueChange(newValue);
      setOpen(false);
    }
  }

  return (
    <Popover open={open} onOpenChange={setOpen} modal={modal}>
      <PopoverTrigger asChild>
        <Button
          onClick={clearSearch}
          disabled={disabled}
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between", !value && "text-muted-foreground")}
        >
          {selectedOption ? selectedOption : initialInputValue ?? inputLabel}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="PopoverContent p-0"
        style={{ width: "var(--radix-popover-trigger-width)" }}
      >
        <Command value={selectedOption ?? ""} shouldFilter={false}>
          <CommandInput onValueChange={handleSearch} placeholder={searchLabel} className="h-9" />
          <CommandList>
            {options.length > 0 && (
              <CommandGroup>
                <CommandItem value={""} onSelect={() => onSelect("")}>
                  {inputLabel}
                  <Check className={cn("ml-auto", value === "" ? "opacity-100" : "opacity-0")} />
                </CommandItem>
                {options.map((option, index) => {
                  if (options.length === index + 1) {
                    return (
                      <CommandItem
                        ref={lastElementRef}
                        key={option.value}
                        value={option.label}
                        onSelect={() => onSelect(option.value)}
                      >
                        {option.label}
                        <Check
                          className={cn(
                            "ml-auto",
                            option.value === value ? "opacity-100" : "opacity-0"
                          )}
                        />
                      </CommandItem>
                    );
                  }

                  return (
                    <CommandItem
                      key={option.value}
                      value={option.label}
                      onSelect={() => onSelect(option.value)}
                    >
                      {option.label}
                      <Check
                        className={cn(
                          "ml-auto",
                          option.value === value ? "opacity-100" : "opacity-0"
                        )}
                      />
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            )}
            {isLoading ? (
              <CommandLoading>
                <Loader className="animate-spin" /> {loadingOptionsLabel}
              </CommandLoading>
            ) : error ? (
              <CommandError>
                <Alert variant="destructive">
                  <TriangleAlert className="text-destructive size-4" />
                  <AlertTitle>¡Error!</AlertTitle>
                  <AlertDescription>
                    <p>{error.message}</p>
                    <Button
                      onClick={retryFetch}
                      variant="outline"
                      size="sm"
                      className="text-muted-foreground"
                    >
                      Reintentar <RotateCcw />
                    </Button>
                  </AlertDescription>
                </Alert>
              </CommandError>
            ) : (
              options.length === 0 && <CommandEmpty>{noOptionsLabel}</CommandEmpty>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

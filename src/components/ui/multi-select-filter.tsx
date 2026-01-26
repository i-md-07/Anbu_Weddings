import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "./utils";
import { Button } from "./button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "./command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "./popover";
import { Badge } from "./badge";

interface MultiSelectFilterProps {
    title: string;
    options: string[];
    selectedValues: string[];
    onChange: (values: string[]) => void;
}

export function MultiSelectFilter({
    title,
    options,
    selectedValues,
    onChange,
}: MultiSelectFilterProps) {
    const [open, setOpen] = React.useState(false);

    const handleSelect = (value: string) => {
        const newValues = selectedValues.includes(value)
            ? selectedValues.filter((v) => v !== value)
            : [...selectedValues, value];
        onChange(newValues);
    };

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="h-10 w-fit justify-between border-dashed"
                >
                    {title}
                    {selectedValues.length > 0 && (
                        <>
                            <div className="mx-2 h-4 w-[1px] bg-accent" />
                            <div className="flex gap-1">
                                {selectedValues.length > 2 ? (
                                    <Badge variant="secondary" className="rounded-sm px-1 font-normal bg-[#8E001C]/10 text-[#8E001C]">
                                        {selectedValues.length} selected
                                    </Badge>
                                ) : (
                                    options
                                        .filter((option) => selectedValues.includes(option))
                                        .map((option) => (
                                            <Badge
                                                variant="secondary"
                                                key={option}
                                                className="rounded-sm px-1 font-normal bg-[#8E001C]/10 text-[#8E001C]"
                                            >
                                                {option}
                                            </Badge>
                                        ))
                                )}
                            </div>
                        </>
                    )}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0" align="start">
                <Command>
                    <CommandInput placeholder={title} />
                    <CommandList>
                        <CommandEmpty>No results found.</CommandEmpty>
                        <CommandGroup className="max-h-64 overflow-auto">
                            {options.map((option) => {
                                const isSelected = selectedValues.includes(option);
                                return (
                                    <CommandItem
                                        key={option}
                                        onSelect={() => handleSelect(option)}
                                    >
                                        <div
                                            className={cn(
                                                "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                                                isSelected
                                                    ? "bg-primary text-primary-foreground"
                                                    : "opacity-50 [&_svg]:invisible"
                                            )}
                                        >
                                            <Check className={cn("h-4 w-4")} />
                                        </div>
                                        <span>{option}</span>
                                    </CommandItem>
                                );
                            })}
                        </CommandGroup>
                        {selectedValues.length > 0 && (
                            <>
                                <div className="p-2 border-t">
                                    <Button
                                        variant="ghost"
                                        className="w-full justify-center text-center text-xs"
                                        onClick={() => onChange([])}
                                    >
                                        Clear filters
                                    </Button>
                                </div>
                            </>
                        )}
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}

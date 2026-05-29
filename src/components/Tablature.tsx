import React from "react"
import { cn } from "@/lib/utils"

interface TablatureProps {
  strings: (number | null)[][]
  className?: string
  highlightCol?: number | null
}

const STRING_LABELS = ["e", "B", "G", "D", "A", "E"]

export const Tablature: React.FC<TablatureProps> = ({
  strings,
  className,
  highlightCol = null,
}) => {
  const maxCols = Math.max(...strings.map((s) => s.length))

  return (
    <div className={cn("overflow-x-auto", className)}>
      <div className="inline-block min-w-full">
        <div className="flex flex-col gap-0">
          {strings.map((stringRow, rowIdx) => (
            <div key={rowIdx} className="flex items-center">
              <span className="w-6 text-xs font-mono text-guitar-amber/70 font-medium">
                {STRING_LABELS[rowIdx]}
              </span>
              <div className="flex items-center ml-2">
                {stringRow.map((fret, colIdx) => (
                  <React.Fragment key={colIdx}>
                    {fret !== null ? (
                      <div className="relative flex items-center justify-center w-10 h-8">
                        <div className="absolute inset-x-0 h-px bg-foreground/30" />
                        <span
                          className={cn(
                            "relative z-10 text-sm font-mono font-bold px-1.5 py-0.5 rounded transition-colors duration-200",
                            highlightCol === colIdx
                              ? "bg-guitar-amber text-guitar-dark scale-110"
                              : "text-foreground bg-card"
                          )}
                        >
                          {fret}
                        </span>
                      </div>
                    ) : (
                      <div className="relative flex items-center justify-center w-10 h-8">
                        <div className="absolute inset-x-0 h-px bg-foreground/20" />
                        <span
                          className={cn(
                            "relative z-10 text-sm font-mono transition-colors duration-200",
                            highlightCol === colIdx
                              ? "text-guitar-amber font-bold"
                              : "text-muted-foreground"
                          )}
                        >
                          —
                        </span>
                      </div>
                    )}
                    {colIdx < maxCols - 1 && (
                      <div className="w-4" />
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Tablature

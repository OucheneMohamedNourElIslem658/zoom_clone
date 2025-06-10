import { Dot, X } from "lucide-react"
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "../ui/card"

export const ErrorCard = ({
    err,
    validationViolations,
    setError,
}: {
    err: string | null
    validationViolations: string[]
    setError: (err: string | null) => void
}) =>
    err ? (
        <Card className="border-destructive bg-destructive/10">
            {err && (
                <CardHeader>
                    <CardTitle className="text-destructive"> {err} </CardTitle>
                    <CardAction>
                        <X className="w-4 h-4 cursor-pointer" onClick={() => setError(null)} />
                    </CardAction>
                </CardHeader>
            )}
            {validationViolations.length > 0 && (
                <CardContent>
                    <ul className="mt-2 space-y-1">
                        {validationViolations.map((violation, index) => (
                            <li key={index} className="text-sm text-destructive flex items-center gap-1">
                                <Dot /> {violation}
                            </li>
                        ))}
                    </ul>
                </CardContent>
            )}
        </Card>
    ) : null
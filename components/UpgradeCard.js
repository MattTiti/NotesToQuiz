import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import ButtonCheckout from "@/components/ButtonCheckout";

export default function UpgradeCard({ plan }) {
  return (
    <div className="relative w-full">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <CardTitle className="text-xl font-bold">
              Upgrade to Unlimited
            </CardTitle>
            <Badge className="bg-emerald-500 text-white">
              <p className="text-sm uppercase font-semibold">
                {`Under $${plan.perMonthPrice}/month`}
              </p>
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-baseline gap-2">
              <p className="text-4xl font-extrabold">${plan.price}</p>
              <p className="text-lg text-black/80 uppercase font-semibold">
                /year
              </p>
            </div>
            <ul className="space-y-2.5 leading-relaxed text-neutral-700">
              {plan.features.map((feature, i) => (
                <li key={i} className="flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="w-[18px] h-[18px] text-black shrink-0"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>{feature.name}</span>
                </li>
              ))}
            </ul>
            <div className="pt-4">
              <ButtonCheckout
                priceId={plan.priceId}
                mode={plan.mode}
                className="w-full bg-yellow-400 hover:bg-yellow-500 text-neutral-900 font-semibold"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

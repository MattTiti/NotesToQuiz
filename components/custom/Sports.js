"use client";

import {
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Combobox } from "@/components/ui/combobox";

export default function Sports({
  customization,
  handleCustomizationChange,
  leagues,
  teams,
  loadingTeams,
  handleTeamChange,
}) {
  return (
    <AccordionItem value="sports">
      <AccordionTrigger>Sports</AccordionTrigger>
      <AccordionContent className="px-2">
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="sports"
              checked={customization.sports.enabled}
              onCheckedChange={(checked) =>
                handleCustomizationChange("sports", "enabled", checked)
              }
            />
            <Label htmlFor="sports">Include sports in your daily text</Label>
          </div>
          <Combobox
            options={leagues.map((league) => ({
              value: league.strLeague,
              label: league.strLeague,
            }))}
            value={customization.sports.league}
            onValueChange={(value) =>
              handleCustomizationChange("sports", "league", value)
            }
          />
          <Combobox
            options={teams.map((team) => ({
              value: team.idTeam,
              label: team.strTeam,
            }))}
            value={customization.sports.teamId}
            onValueChange={handleTeamChange}
            disabled={!customization.sports.league || loadingTeams}
          />
          <div className="space-y-2">
            <Label>Game information:</Label>
            <div className="flex flex-col space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="sportsPreviousGame"
                  checked={customization.sports.showPreviousGame}
                  onCheckedChange={(checked) =>
                    handleCustomizationChange(
                      "sports",
                      "showPreviousGame",
                      checked
                    )
                  }
                />
                <Label htmlFor="sportsPreviousGame">
                  Include last game result
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="sportsNextGame"
                  checked={customization.sports.showNextGame}
                  onCheckedChange={(checked) =>
                    handleCustomizationChange("sports", "showNextGame", checked)
                  }
                />
                <Label htmlFor="sportsNextGame">
                  Include next game schedule
                </Label>
              </div>
            </div>
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}
// components/header.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  EllipsisVertical,
  CircleHelp,
  Lightbulb,
  Flag,
  Calendar,
  Info,
  Settings,
} from "lucide-react";
import { HeaderProps } from "@/types/types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { sendActionData } from "@/utils/action";
import { DialogMenuItem } from "@/components/semantix/dialogmenuitem";

export default function Header({
  gameNumber,
  guessCount,
  targetWord,
  hintCount,
  onHint,
  onSurrender,
  playerId,
  difficulty,
  targetWordId,
}: HeaderProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleSurrenderWithAPI = (closeDialog: () => void) => {
    const success = onSurrender();
    if (success) {
      closeDialog();
    }
  };

  return (
    <header className='py-4'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-4xl font-bold'>SEMANTIX</h1>
          <p className='text-gray-600'>
            SPIEL: #{gameNumber} | VERSUCHE: {guessCount}
          </p>
        </div>

        <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
          <DropdownMenuTrigger asChild>
            <Button variant='ghost' size='icon'>
              <EllipsisVertical />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent>
            <DialogMenuItem
              icon={<CircleHelp />}
              title='Wie funktioniert das Spiel?'
              dialogTitle='Spielanleitung'
              dialogDescription='Erfahren Sie, wie das Spiel funktioniert'
            >
              <div className='space-y-4'>
                <p className='text-base'>
                  Finde das <strong>geheime Wort</strong>. Du hast{" "}
                  <strong>unbegrenzt viele Versuche</strong>!
                </p>

                <p className='text-base'>
                  Die Wörter wurden von einem <strong>KI-Algorithmus</strong>{" "}
                  nach ihrer Ähnlichkeit zum gesuchten Wort sortiert.
                </p>

                <p className='text-base'>
                  Nach der Eingabe eines Wortes siehst du dessen{" "}
                  <strong>prozentuale Nähe</strong> zum Zielwort. Das gesuchte
                  Wort hat <strong>100 Prozent</strong>!
                </p>

                <p className='text-base'>
                  Der Algorithmus hat <strong>tausende von Texten</strong>{" "}
                  analysiert. Er nutzt den <strong>Kontext</strong>, in dem
                  Wörter verwendet werden, um die Ähnlichkeit zwischen ihnen zu
                  berechnen.
                </p>
              </div>
            </DialogMenuItem>

            <DialogMenuItem
              icon={<Lightbulb />}
              title='Tipp'
              dialogTitle='Hilfetipp'
              dialogDescription='Erhalte Hinweise zum gesuchten Wort'
              onOpen={() => {
                if (targetWord) {
                  onHint();
                  sendActionData({
                    playerId,
                    difficulty,
                    targetWordId,
                    isHint: true,
                  }).catch((error) =>
                    console.error("Error sending hint data:", error)
                  );
                }
              }}
            >
              {targetWord ? (
                <div className='space-y-4'>
                  <p className='text-lg font-mono tracking-widest'>
                    {Array.from(targetWord).map((char, index) => (
                      <span key={index} className='mx-1'>
                        {index < hintCount - 1 ? char : "_"}
                      </span>
                    ))}
                  </p>
                  <div className='text-sm text-muted-foreground'>
                    {hintCount === 0 && "Erster Tipp: Wortlänge anzeigen"}
                    {hintCount === 1 &&
                      `Das Wort hat ${targetWord.length} Buchstaben`}
                    {hintCount > 1 &&
                      `Buchstabe ${hintCount - 1} von ${targetWord.length}`}
                  </div>
                </div>
              ) : (
                <p className='text-base'>
                  Machen Sie zuerst einen Versuch um{" "}
                  <strong className='font-bold'>Tipps</strong> freizuschalten!
                </p>
              )}
            </DialogMenuItem>

            <DialogMenuItem
              icon={<Flag />}
              title='Aufgeben'
              dialogTitle='Wirklich aufgeben?'
            >
              {({ closeDialog }) => (
                <div className='flex justify-end gap-2 mt-4'>
                  <Button variant='outline' onClick={closeDialog}>
                    Abbrechen
                  </Button>
                  <Button
                    variant='destructive'
                    onClick={() => {
                      handleSurrenderWithAPI(closeDialog);
                    }}
                  >
                    Bestätigen
                  </Button>
                </div>
              )}
            </DialogMenuItem>

            <DialogMenuItem
              icon={<Calendar />}
              title='Frühere Spiele'
              dialogTitle='Spielverlauf'
            >
              <p>Hier kommt die Liste der früheren Spiele...</p>
            </DialogMenuItem>

            <DropdownMenuSeparator />

            <DialogMenuItem
              icon={<Settings />}
              title='Einstellungen'
              dialogTitle='Spieleinstellungen'
              dialogDescription='Passe die Spieleinstellungen an'
            >
              <p>Hier kommen die Einstellungen zum Spiel...</p>
            </DialogMenuItem>

            <DialogMenuItem
              icon={<Info />}
              title='Credits'
              dialogTitle='Credits'
              dialogDescription='Informationen über die verwendeten Ressourcen und Danksagungen'
            >
              <div className='space-y-4'>
                <p className='text-base'>
                  Inspiriert von{" "}
                  <a
                    href='https://semantle.com/'
                    target='_blank'
                    rel='noopener noreferrer'
                    className='font-semibold hover:text-blue-600 cursor-pointer'
                  >
                    Semantle
                  </a>
                </p>

                <p className='text-base'>
                  Das Vokabular zur Berechnung der Wortähnlichkeiten stammt von{" "}
                  <a
                    href='https://www.openthesaurus.de/'
                    target='_blank'
                    rel='noopener noreferrer'
                    className='font-semibold hover:text-blue-600 cursor-pointer'
                  >
                    OpenThesaurus
                  </a>
                </p>

                <p className='text-base'>
                  Die Berechnung der Embeddings basiert auf dem{" "}
                  <a
                    href='https://huggingface.co/jinaai/jina-embeddings-v3'
                    target='_blank'
                    rel='noopener noreferrer'
                    className='font-semibold hover:text-blue-600 cursor-pointer'
                  >
                    jina-embeddings-v3
                  </a>{" "}
                  Model
                </p>
              </div>
            </DialogMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

# PassProve — hostovaný ověřovací widget

Prototyp Next.js s ověřovacími stránkami a zdrojovými kódy API pro widget.

**Stav:** Starší nebo souběžná varianta PassProve uchovaná jako reference; nejde o označení hlavní produkční verze.

## Co projekt obsahuje

- Rozhraní pro obličej, OCR, QR a opakované ověření.
- API pro zahájení, výběr metody a kontrolu průběhu ověřování.
- Cesta poskytující skript widgetu a zdroj pro vyhledání e-shopu.

## Technologie

Next.js, React, TypeScript, Tailwind CSS, Supabase.

## Architektura a struktura

- `app/api/` — API widgetu a ověřování
- `app/verification/` — hostovaná ověřovací stránka
- `components/` — ověřovací rozhraní
- `lib/api-client.ts` — klient API

## Lokální vývoj

Potřebujete Node.js a npm. V kořenové složce repozitáře spusťte:

```sh
npm install
npm run dev
```

Příkaz pro sestavení uvedený v projektu: `npm run build`.

Jde o příkazy deklarované v repozitáři, nikoli o potvrzení úspěšného sestavení. Instalace závislostí, sestavení ani napojení na živé služby nebyly při úpravě dokumentace spuštěny.

## Konfigurace a omezení

Komponenty mají souběžné kopie v `app/components/` a `components/`; přítomné jsou také samostatné ukázky. Před použitím ověřte aktivní cesty a oprávnění serverové části. Příbuzný rozsah mají `widget_v` a `passprove2`, nejde však o potvrzení úplné shody.

## Co doplnit do dokumentace

Snímky obrazovky s fiktivními daty, opakovatelný postup ověření a přehled skutečně otestovaných integrací. Přihlašovací údaje a konfigurace konkrétního nasazení patří mimo Git.

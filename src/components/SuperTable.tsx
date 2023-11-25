import CurrentTime from './CurrentTime'
import { useLCDClient } from "@terra-money/wallet-provider"
import { useEffect, useState } from "react";
import { figo } from "../flib";

interface PricesList {
    tb: number,
    ab: number,
    ts: number,
    as: number,
}

interface InterList {
    AT: number,
    TA: number
}

function PricesJSX(p: PricesList, fixedV: number = 2) {
    return (
      <>
        <tr>
          <td>BUY</td>
          <td className="BigCurs">{p.tb?.toFixed(fixedV)}</td>
          <td className="BigCurs">{p.ab?.toFixed(fixedV)}</td>
        </tr>
        <tr>
          <td>SELL</td>
          <td className="BigCurs">{p.ts?.toFixed(fixedV)}</td>
          <td className="BigCurs">{p.as?.toFixed(fixedV)}</td>
        </tr>
      </>
    )
}

function IntersectionJSX(inter: InterList) {
    const redOrYellow = (v: number) => {
        if (v >= 500) return "colorRed";
        else if (v >= 100) return "colorYellow";
        return "";
    }
    const signal = redOrYellow(inter.AT);
    const signal2 = redOrYellow(inter.TA);
    return (
      <>
        <tr>
          <td> </td>
          <td className={"BigNumber " + signal}>{inter.AT}</td>
          <td className={"BigNumber " + signal2}>{inter.TA}</td>
        </tr>
      </>
    )
}

export default function SuperTable() {
    const lcd = useLCDClient();

    const [prices, setPrices] = useState<PricesList>({ tb: 0, ab: 0, ts: 0, as: 0 });
    const [inter, setInter] = useState<InterList>({ AT: 0, TA: 0 });

    useEffect(() => {
        const timer = setInterval(() => {
            fetchData().catch(console.error);
        }, 1000);
        const fetchData = async () => {
            const terra1 = await figo.price(lcd, figo.TerraswapPair.LUNC_USTC);
            const astro1 = await figo.price(lcd, figo.AstroportPair.LUNC_USTC);

            setPrices({
                tb: terra1.coin1,
                ab: astro1.coin1,
                ts: terra1.coin2,
                as: astro1.coin2
            });

            const tm5 = await figo.profit(
                lcd,
                figo.AstroportPair.LUNC_USTC,
                figo.TerraswapPair.LUNC_USTC,
                "A",
                "T"
            );
            const tm6 = await figo.profit(
                lcd,
                figo.TerraswapPair.LUNC_USTC,
                figo.AstroportPair.LUNC_USTC,
                "T",
                "A"
            );
            setInter({
                AT: Math.floor(tm5),
                TA: Math.floor(tm6)
            });
        }

        return () => {
            clearInterval(timer);
        };
    });

    return (
      <>
        <table className='supertable'>
          <thead>
          <tr>
            <th colSpan={3}>{<CurrentTime />}</th>
          </tr>
          <tr>
            <th>in LUNC</th>
            <th>T</th>
            <th>A</th>
          </tr>
          </thead>
          <tbody>
            {PricesJSX(prices)}
          </tbody>
      </table>
      <table className='intertable'>
        <thead>
          <tr>
            <th> </th>
            <th>A-&gt;T</th>
            <th>T-&gt;A</th>
          </tr>
        </thead>
        <tbody>
          {IntersectionJSX(inter)}
        </tbody>
      </table>
      </>
    );
}
import { useLCDClient } from "@terra-money/wallet-provider";
import { useEffect, useState } from "react";
import { figo } from "../flib";

interface BeautifulList {
    tfrom: number,
    tto: number,
    afrom: number,
    ato: number,
}

function BCard(fr: string, to: string, bl: BeautifulList) {
    const _fr = fr == "T" ? bl.tfrom : (fr == "A" ? bl.afrom : NaN);
    const _to = to == "T" ? bl.tto : (to == "A" ? bl.ato : NaN);
    return (
      <div>
        <h3 className="timer">{figo.getNormalDateTime()}</h3>
        {fr}: <b>SELL</b> <div className="petit">{figo.TEN_THOUSAND}</div><div className="petit-coin">lunc</div><br/>
        <b>GET</b>{" "}
        <div className="petit">{_fr?.toFixed(2)}</div><div className="petit-coin">ustc</div>
        <br />
        {to}: <b>SELL</b> <div className="petit">{bl.afrom?.toFixed(2)}</div><div className="petit-coin">ustc</div><br/>
        <b>GET</b>{" "}
        <div className="petit">{_to?.toFixed(2)}</div><div className="petit-coin">lunc</div>
        <br />
        Diff: <div className="petit">{_to?.toFixed(2)} - {figo.TEN_THOUSAND} ={" "}
        {Math.floor(_to - figo.TEN_THOUSAND)}</div>
        <br />
      </div>
    );
}

export default function Output() {
    const lcd = useLCDClient();
    
    const [bl, setBl] = useState<BeautifulList>({ tfrom: 0, tto: 0, afrom: 0, ato: 0 });

    useEffect(() => {
        const timer = setInterval(() => {
            fetchData().catch(console.error);
        }, 1000);

        const fetchData = async () => {
            // T->A
            let res1: { return_amount: number } = await lcd.wasm.contractQuery(
                figo.TerraswapPair.LUNC_USTC.pair,
                figo.sim(figo.TEN_THOUSAND, figo.FCoins.LUNC)
            );
            const _tfrom = res1.return_amount / figo.ONE_MILLION;
            
            let si1: { return_amount: number } = await lcd.wasm.contractQuery(
                figo.AstroportPair.LUNC_USTC.pair,
                figo.sim(_tfrom, figo.FCoins.USTC)
            );
            const _tto = si1.return_amount / figo.ONE_MILLION;
            
            let OPTI = _tto - figo.TEN_THOUSAND;

            // A->T
            res1 = await lcd.wasm.contractQuery(
                figo.AstroportPair.LUNC_USTC.pair,
                figo.sim(figo.TEN_THOUSAND, figo.FCoins.LUNC)
            );
            const _afrom = res1.return_amount / figo.ONE_MILLION;
            
            si1 = await lcd.wasm.contractQuery(
                figo.TerraswapPair.LUNC_USTC.pair,
                figo.sim(_afrom, figo.FCoins.USTC)
            );
            const _ato = si1.return_amount / figo.ONE_MILLION;

            setBl({
                tfrom: _tfrom,
                afrom: _afrom,
                ato: _ato,
                tto: _tto
            });
        }

        return () => {
            clearInterval(timer);
        };
    }, [lcd.wasm]);

    return (
        <>
          <table className="bftable">
            <tbody>
              <tr>
                <td>{BCard("A", "T", bl)}</td>
                <td>{BCard("T", "A", bl)}</td>
              </tr>
            </tbody>
          </table>
        </>
    );
}
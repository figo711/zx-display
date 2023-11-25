import { LCDClient } from '@terra-money/terra.js';

export namespace figo {
    export const ONE_MILLION = 1_000_000;
    export const TEN_THOUSAND = 10_000;
    
    export namespace FCoins {
        export const LUNC = "uluna";
        export const USTC = "uusd";
        export const stLUNA = "terra1yg3j2s986nyp5z7r2lvt0hx3r0lnd7kwvwwtsc";
    };
    
    interface IPair {
        name: string;
        LUNC_USTC: ILittlePair,
        LUNC_stLUNA: ILittlePair
    }

    interface ILittlePair {
        pair: string,
        coin1: string,
        coin2: string
    }

    export const TerraswapPair: IPair = {
        name: "T",
        LUNC_USTC: {
          pair: "terra1tndcaqxkpc5ce9qee5ggqf430mr2z3pefe5wj6",
          coin1: FCoins.LUNC,
          coin2: FCoins.USTC
        },
        LUNC_stLUNA: {
          pair: "terra1de8xa55xm83s3ke0s20fc5pxy7p3cpndmmm7zk",
          coin1: FCoins.LUNC,
          coin2: FCoins.stLUNA
        }
    };
      
    export const AstroportPair: IPair = {
        name: "A",
        LUNC_USTC: {
          pair: "terra1m6ywlgn6wrjuagcmmezzz2a029gtldhey5k552",
          coin1: FCoins.LUNC,
          coin2: FCoins.USTC,
        },
        LUNC_stLUNA: {
          pair: "terra1gxjjrer8mywt4020xdl5e5x7n6ncn6w38gjzae",
          coin1: FCoins.LUNC,
          coin2: FCoins.stLUNA,
        }
    };

    export function sim(amount: number, denom: string) {
        return {
          simulation: {
            offer_asset: {
              amount: Math.round(amount * ONE_MILLION).toString(),
              info: !denom.startsWith("terra") ? 
                { native_token: { denom: denom }} :
                { token: { contract_addr: denom }}
            },
          },
        };
    }

    export async function price(lcd: LCDClient, pair: ILittlePair) {
        const ra1: { return_amount: number } = await lcd.wasm.contractQuery(
          pair.pair,
          sim(TEN_THOUSAND, pair.coin1)
        );
        const r2: { return_amount: number } = await lcd.wasm.contractQuery(
          pair.pair,
          sim(TEN_THOUSAND, pair.coin2)
        );
        const r1 = TEN_THOUSAND / (ra1.return_amount / ONE_MILLION);
        const r22 = TEN_THOUSAND / (r2.return_amount / ONE_MILLION);
        const r3 = 1 / r22;
        return { coin1: r1, coin2: r3 };
    }

    export async function profit(
        lcd: LCDClient, _from: ILittlePair, _to: ILittlePair, _f: string, _t: string
        ) {

        const res: { return_amount: number } = await lcd.wasm.contractQuery(
          _from.pair,
          sim(TEN_THOUSAND, _from.coin1)
        );
        const _from_amount = res.return_amount / ONE_MILLION;
      
        const si: { return_amount: number } = await lcd.wasm.contractQuery(
          _to.pair, 
          sim(_from_amount, _to.coin2)
        );
        const _to_amount = si.return_amount / ONE_MILLION;
      
        return _to_amount - TEN_THOUSAND;
    }

    export function getNormalDateTime() {
        const _d = new Date();
        const d = _d.toLocaleDateString("ru-RU"); // 24.08.2022
        const t = _d.toLocaleTimeString("ru-RU"); // 00:00:00
        const d2 = d.substring(0, 6) + d.substring(8);
        return `${d2}-${t}`;
    }
}
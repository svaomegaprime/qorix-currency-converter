import { flags } from 'iso-country-flagss'
export default function FlagStyles({ style }) {
    return (
        {
            "3d_flag": <div style={{ width: "20px", height: "20px" }}>
                <img src={`${flags.get("bd", "3d")}`} width={"20px"} style={{ aspectRatio: "3/2" }} />
            </div>,
            "2d_flag": <div style={{ width: "20px", height: "20px" }}>
                <img src={`${flags.get("bd", "2d")}`} width={"20px"} style={{ aspectRatio: "3/2" }} />
            </div>,
            "no_flag": <div style={{ width: "20px", height: "20px" }}>
                <img src="/dash-line.png" width={"20px"} />
            </div>
        }[style]
    )
}
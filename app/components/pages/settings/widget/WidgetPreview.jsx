import CustomSection from "../../../essentials/CustomSection";
import WidgetType from "./components/WidgetType";
import Position from "./components/Position";
import OffsetFromEdge from "./components/OffsetFromEdge";
import ThemeCustomisation from "./components/ThemeCustomisation";
import Visibility from "./components/Visibility";
import { useEffect, useState } from "react";
import * as Flags from "country-flag-icons/react/3x2";

export default function WidgetPreview({ data, handleChange }) {
    const [activeDevice, setActiveDevice] = useState("desktop");
    const [scrollPosition, setScrollPosition] = useState(0);
    const { widgetSettings } = data;
    const { visibility } = widgetSettings;
    const { position } = widgetSettings;
    const { offsetFromEdge } = widgetSettings;
    const themeCustomisation = {
        backgroundColor: "#ffffff",
        textColor: "#303030",
        borderColor: "#b8b8b8",
        hoverBackground: "#f3f3f3",
        hoverColor: "#202020",
        borderRadius: 8,
        shadow: "none",
        ...widgetSettings.themeCustomisation
    };
    useEffect(() => {
        const handleScroll = () => {
            setScrollPosition(window.scrollY);
        };
        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);
    const [desktopFrameSize, setDesktopFrameSize] = useState({ desktopPixelWidth: 0, desktopPixelHeight: 0 });
    const [mobileFrameSize, setMobileFrameSize] = useState({ mobilePixelWidth: 0, mobilePixelHeight: 0 });
    useEffect(() => {
        const handleResize = () => {
            const desktopFrame = document.querySelector("#desktop-preview-frame");
            if (desktopFrame) {
                const desktopPixelWidth = desktopFrame.clientWidth / 1920;
                const desktopPixelHeight = desktopFrame.clientHeight / 1080;
                setDesktopFrameSize({ desktopPixelWidth, desktopPixelHeight });
            }

            const mobileFrame = document.querySelector("#mobile-preview-frame");
            if (mobileFrame) {
                const mobilePixelWidth = mobileFrame.clientWidth / 390;
                const mobilePixelHeight = mobileFrame.clientHeight / 844;
                setMobileFrameSize({ mobilePixelWidth, mobilePixelHeight });
            }
        };

        const observer = new ResizeObserver(() => {
            handleResize();
        });

        const desktopFrame = document.querySelector("#desktop-preview-frame");
        if (desktopFrame) observer.observe(desktopFrame);

        const mobileFrame = document.querySelector("#mobile-preview-frame");
        if (mobileFrame) observer.observe(mobileFrame);

        handleResize();
        window.addEventListener("resize", handleResize);
        return () => {
            window.removeEventListener("resize", handleResize);
            observer.disconnect();
        };
    }, [activeDevice]);
    const desktopHorizontalOffset = offsetFromEdge.horizontal * desktopFrameSize.desktopPixelWidth;
    const desktopVerticalOffset = offsetFromEdge.vertical * desktopFrameSize.desktopPixelHeight;
    const mobileHorizontalOffset = offsetFromEdge.horizontal * mobileFrameSize.mobilePixelWidth;
    const mobileVerticalOffset = offsetFromEdge.vertical * mobileFrameSize.mobilePixelHeight;
    return (
        <s-query-container>
            <s-grid gridTemplateColumns="@container (inline-size > 675px) 6fr 1fr 9fr, 1fr" gap="@container (inline-size < 675px) small">
                <s-grid-item>
                    <CustomSection>
                        <s-stack gap="base">
                            {/* <WidgetType data={data} handleChange={handleChange} />
                            <s-divider /> */}
                            <Position data={data} handleChange={handleChange} />
                            <s-divider />
                            <OffsetFromEdge data={data} handleChange={handleChange} />
                            <s-divider />
                            <ThemeCustomisation data={data} handleChange={handleChange} />
                            <s-divider />
                            <Visibility data={data} handleChange={handleChange} />
                        </s-stack>
                    </CustomSection>
                </s-grid-item>
                <s-grid-item>
                    {/* empty space */}
                </s-grid-item>
                <s-grid-item>
                    <div style={{ position: "sticky", top: "40px" }}>
                        <CustomSection>
                            <s-grid gridTemplateColumns="auto 1fr" alignItems="center">
                                <s-text>Preview</s-text>
                                <s-stack alignItems="end">
                                    <s-button-group gap="none">
                                        <s-button slot="secondary-actions" icon="desktop" onClick={() => setActiveDevice("desktop")}>
                                            <div style={{ position: "absolute", top: "0", left: "0", width: "100%", height: "100%", background: activeDevice === "desktop" ? "#0000000f" : "transparent", borderRadius: "8px 0 0 8px" }}></div>
                                            Desktop
                                        </s-button>
                                        <s-button slot="secondary-actions" icon="mobile" onClick={() => setActiveDevice("mobile")}>
                                            <div style={{ position: "absolute", top: "0", left: "0", width: "100%", height: "100%", background: activeDevice === "mobile" ? "#0000000f" : "transparent", borderRadius: "0 8px 8px 0" }}></div>
                                            Mobile
                                        </s-button>
                                    </s-button-group>
                                </s-stack>
                            </s-grid>
                            {/* desktop preview start */}
                            {activeDevice === "desktop" && (
                                <s-stack paddingBlock="large">
                                    <div style={{ width: "100%", position: "relative", zIndex: "3" }}>
                                        <img src="/desktop.png" alt="Desktop Mode" style={{ width: "100%", pointerEvents: "none", zIndex: "-1" }} />
                                        <div id="desktop-preview-frame">
                                            <img className="background" src="/desktop-preview.jpg" alt="Desktop Preview" />
                                            {visibility?.enableOnDesktop && (
                                                <div id="preview-desktop">
                                                    <div className="widget_buttons_wrapper widget_single">
                                                        <div className="widget_button">
                                                            <div className="widget_button_flag">
                                                                <Flags.US />
                                                            </div>
                                                            <div className="widget_button_text">
                                                                USD
                                                            </div>
                                                            <div className="widget_button_icon">
                                                                <s-icon type="chevron-down" />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <style>
                                        {`
                                        #desktop-preview-frame{
                                            position: absolute;
                                            top: 3%;
                                            left: 2.7%;
                                            height: 56%;
                                            width: 94.7%;
                                            overflow: hidden;
                                            z-index: 2;
                                        }
                                        #desktop-preview-frame .background{
                                            width: 100%;
                                            position: absolute;
                                            top: -${scrollPosition}px;
                                            left: 0;
                                            z-index: -1;
                                        }
                                        ${position === "top_left" ? `
                                            #preview-desktop{
                                                top: ${desktopVerticalOffset}px;
                                                left: ${desktopHorizontalOffset}px;
                                                transform: scale(0.5);
                                                transform-origin: top left;
                                            }
                                        ` : ""}
                                        ${position === "top_center" ? `
                                            #preview-desktop{
                                                top: ${desktopVerticalOffset}px;
                                                left: calc(50% + ${desktopHorizontalOffset}px);
                                                transform: translate(-50%, 0) scale(0.5);
                                                transform-origin: top center;
                                            }
                                        ` : ""}
                                        ${position === "top_right" ? `
                                            #preview-desktop{
                                                top: ${desktopVerticalOffset}px;
                                                right: ${desktopHorizontalOffset}px;
                                                transform: scale(0.5);
                                                transform-origin: top right;
                                            }
                                        ` : ""}
                                        ${position === "middle_left" ? `
                                            #preview-desktop{
                                                top: calc(50% + ${desktopVerticalOffset}px);
                                                left: ${desktopHorizontalOffset}px;
                                                transform: translate(0, -50%) scale(0.5);
                                                transform-origin: center left;
                                            }
                                        ` : ""}
                                        ${position === "middle_right" ? `
                                            #preview-desktop{
                                                top: calc(50% + ${desktopVerticalOffset}px);
                                                right: ${desktopHorizontalOffset}px;
                                                transform: translate(0, -50%) scale(0.5);
                                                transform-origin: center right;
                                            }
                                        ` : ""}
                                        ${position === "bottom_left" ? `
                                            #preview-desktop{
                                                bottom: ${desktopVerticalOffset}px;
                                                left: ${desktopHorizontalOffset}px;
                                                transform: scale(0.5);
                                                transform-origin: bottom left;
                                            }
                                        ` : ""}
                                        ${position === "bottom_center" ? `
                                            #preview-desktop{
                                                bottom: ${desktopVerticalOffset}px;
                                                left: calc(50% + ${desktopHorizontalOffset}px);
                                                transform: translate(-50%, 0) scale(0.5);
                                                transform-origin: bottom center;
                                            }
                                        ` : ""}
                                        ${position === "bottom_right" ? `
                                            #preview-desktop{
                                                bottom: ${desktopVerticalOffset}px;
                                                right: ${desktopHorizontalOffset}px;
                                                transform: scale(0.5);
                                                transform-origin: bottom right;
                                            }
                                        ` : ""}
                                        #preview-desktop{
                                            position: absolute;
                                            width: fit-content;
                                            height: fit-content;
                                            padding: 10px;
                                        }
                                        .widget_buttons_wrapper{
                                            width: fit-content;
                                            height: fit-content;
                                        }
                                        .widget_button{
                                            width: fit-content;
                                            height: fit-content;
                                            display: flex;
                                            align-items: center;
                                            gap: 7px;
                                            flex-wrap: nowrap;
                                            border: 1px solid ${themeCustomisation.borderColor};
                                            border-radius: ${themeCustomisation.borderRadius}px;
                                            background: ${themeCustomisation.backgroundColor};
                                            padding: 5px 10px;
                                            cursor: pointer;
                                        }
                                        .widget_button_flag{
                                            width: 20px;
                                            height: 20px;
                                            display: flex;
                                            align-items: center;
                                        }
                                        .widget_button_text{
                                            font-size: 14px;
                                            line-height: 20px;
                                        }
                                        .widget_button_icon{
                                            width: fit-content;
                                            height: 20px;
                                            display: flex;
                                            align-items: center;
                                            margin-left: 5px;
                                        }
                                        @media(max-width: 804px){
                                            #desktop-preview-frame .background{
                                                top: 0;
                                            }
                                        }
                                        `}
                                    </style>
                                </s-stack>
                            )}
                            {/* desktop preview end */}
                            {/* mobile preview start */}
                            {activeDevice === "mobile" && (
                                <s-stack paddingBlock="large">
                                    <div style={{ width: "100%", position: "relative", zIndex: "3", maxWidth: "250px", margin: "0 auto" }}>
                                        <img src="/mobile.png" alt="Mobile Mode" style={{ width: "100%", pointerEvents: "none", zIndex: "-1" }} />
                                        <div id="mobile-preview-frame">
                                            <img className="background" src="/mobile-preview.jpg" alt="Mobile Preview" />
                                            {visibility.enableOnMobile && (
                                                <div id="preview-mobile">
                                                    <div className="widget_buttons_wrapper widget_single">
                                                        <div className="widget_button">
                                                            <div className="widget_button_flag">
                                                                <Flags.US />
                                                            </div>
                                                            <div className="widget_button_text">
                                                                USD
                                                            </div>
                                                            <div className="widget_button_icon">
                                                                <s-icon type="chevron-down" />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <style>
                                        {`
                                        #mobile-preview-frame {
                                            position: absolute;
                                            top: 2.25%;
                                            left: 4.7%;
                                            height: 94.5%;
                                            width: 90%;
                                            overflow: hidden;
                                            z-index: 2;
                                            border-radius: 22px;
                                        }
                                        #mobile-preview-frame .background{
                                            width: 100%;
                                            position: absolute;
                                            top: -${scrollPosition}px;
                                            left: 0;
                                            z-index: -1;
                                        }
                                        ${position === "top_left" ? `
                                            #preview-mobile{
                                                top: ${mobileVerticalOffset}px;
                                                left: ${mobileHorizontalOffset}px;
                                                transform: scale(0.7);
                                                transform-origin: top left;
                                            }
                                        ` : ""}
                                        ${position === "top_center" ? `
                                            #preview-mobile{
                                                top: ${mobileVerticalOffset}px;
                                                left: calc(50% + ${mobileHorizontalOffset}px);
                                                transform: translate(-50%, 0) scale(0.7);
                                                transform-origin: top center;
                                            }
                                        ` : ""}
                                        ${position === "top_right" ? `
                                            #preview-mobile{
                                                top: ${mobileVerticalOffset}px;
                                                right: ${mobileHorizontalOffset}px;
                                                transform: scale(0.7);
                                                transform-origin: top right;
                                            }
                                        ` : ""}
                                        ${position === "middle_left" ? `
                                            #preview-mobile{
                                                top: calc(50% + ${mobileVerticalOffset}px);
                                                left: ${mobileHorizontalOffset}px;
                                                transform: translate(0, -50%) scale(0.7);
                                                transform-origin: center left;
                                            }
                                        ` : ""}
                                        ${position === "middle_right" ? `
                                            #preview-mobile{
                                                top: calc(50% + ${mobileVerticalOffset}px);
                                                right: ${mobileHorizontalOffset}px;
                                                transform: translate(0, -50%) scale(0.7);
                                                transform-origin: center right;
                                            }
                                        ` : ""}
                                        ${position === "bottom_left" ? `
                                            #preview-mobile{
                                                bottom: ${mobileVerticalOffset}px;
                                                left: ${mobileHorizontalOffset}px;
                                                transform: scale(0.7);
                                                transform-origin: bottom left;
                                            }
                                        ` : ""}
                                        ${position === "bottom_center" ? `
                                            #preview-mobile{
                                                bottom: ${mobileVerticalOffset}px;
                                                left: calc(50% + ${mobileHorizontalOffset}px);
                                                transform: translate(-50%, 0) scale(0.7);
                                                transform-origin: bottom center;
                                            }
                                        ` : ""}
                                        ${position === "bottom_right" ? `
                                            #preview-mobile{
                                                bottom: ${mobileVerticalOffset}px;
                                                right: ${mobileHorizontalOffset}px;
                                                transform: scale(0.7);
                                                transform-origin: bottom right;
                                            }
                                        ` : ""}
                                        #preview-mobile{
                                            position: absolute;
                                            width: fit-content;
                                            height: fit-content;
                                            padding: 10px;
                                        }
                                        .widget_buttons_wrapper{
                                            width: fit-content;
                                            height: fit-content;
                                        }
                                        .widget_button{
                                            width: fit-content;
                                            height: fit-content;
                                            display: flex;
                                            align-items: center;
                                            gap: 7px;
                                            flex-wrap: nowrap;
                                            border: 1px solid ${themeCustomisation.borderColor};
                                            border-radius: ${themeCustomisation.borderRadius}px;
                                            background: ${themeCustomisation.backgroundColor};
                                            padding: 5px 10px;
                                            cursor: pointer;
                                        }
                                        .widget_button_flag{
                                            width: 20px;
                                            height: 20px;
                                            display: flex;
                                            align-items: center;
                                        }
                                        .widget_button_text{
                                            font-size: 14px;
                                            line-height: 20px;
                                        }
                                        .widget_button_icon{
                                            width: fit-content;
                                            height: 20px;
                                            display: flex;
                                            align-items: center;
                                            margin-left: 5px;
                                        }
                                        @media(max-width: 804px){
                                            #mobile-preview-frame .background{
                                                top: 0;
                                            }
                                        }
                                        `}
                                    </style>
                                </s-stack>
                            )}
                            {/* mobile preview end */}
                        </CustomSection>
                    </div>
                </s-grid-item>
            </s-grid>
        </s-query-container>
    )
}

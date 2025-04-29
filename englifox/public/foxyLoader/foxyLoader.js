import { svgElementCreator } from "../../src/modules/utils/svgElementCreator/svgElementCreator";
import styles from "./styles.module.css";

export const foxyLoader = () => {
  const svg = svgElementCreator("svg", {
    width: "200",
    height: "250",
    viewBox: "0 0 200 250",
    style: "display: block; margin: 0 auto;",
  })

  svg.append(svgElementCreator("circle", {
    cx: "100", cy: "100", r: "70", fill: "none", stroke: "none"
  }))

  for(let i = 0; i < 12; i++) {
    const angle = (i/12) * 2 * Math.PI
    const x = 100 + 70 * Math.cos(angle)
    const y = 100 + 70 * Math.sin(angle)

    const footprint = svgElementCreator("circle", {
      cx: x, cy: y, r: "3", class: styles["footprint"]
    })
    footprint.style.animationDelay = `${i * 0.3}s`
    svg.append(footprint)
  }

  const loadingText = svgElementCreator("text", {
    x: "100", y: "230", class: styles["loading-text"]
  })
  loadingText.textContent = "Ловим ваши данные..."
  svg.append(loadingText)
  return svg
}

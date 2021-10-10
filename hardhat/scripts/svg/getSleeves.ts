
import * as fs from "fs";
import { ethers } from "hardhat"

const bodyEquippables = Array()
const sleeves = Array()

const equippablesSvgs = [
  // bodyEquippable('8_MarineJacket'), // bodyEquippable("8_MarineJacket"),
  // bodyEquippable('11_MessDress'), // bodyEquippable("11_MessDress"),
  // bodyEquippable('15_RedPlaid'), // bodyEquippable("15_RedPlaid"),
  // bodyEquippable('16_BluePlaid'), //  bodyEquippable("16_BluePlaid"),
  // bodyEquippable('19_AaveHeroShirt'), // bodyEquippable("19_AaveHeroShirt"),
  // bodyEquippable('22_CaptainAaveSuit'), // bodyEquippable("22_CaptainAaveSuit"),
  // bodyEquippable('28_MarcOutfit'), // bodyEquippable("28_MarcOutfit"),
  // bodyEquippable('31_JordanSuit'), // bodyEquippable("31_JordanSuit"),
  // bodyEquippable('37_ETHTShirt'),
  // bodyEquippable('43_NogaraEagleArmor'),
  // bodyEquippable('46_HalfRektShirt'),
  bodyEquippable('50_GldnXrossRobe'),
  // bodyEquippable('54_LlamacornShirt'),
  bodyEquippable('56_AagentShirt')
  // bodyEquippable('74_JaayHaoSuit'),
  // bodyEquippable('85_GentlemanSuit'),
  // bodyEquippable('91_PajamaPants'),
  // bodyEquippable('102_WitchCape'),
  // bodyEquippable('105_ProductionMageArmor'),
  // bodyEquippable('109_RastaShirt'),
  // bodyEquippable('112_HazmatSuit'),
  // bodyEquippable('114_RedHawaiianShirt'),
  // bodyEquippable('115_BlueHawaiianShirt')
]

function stripSvg (svg) {
  // removes svg tag
  if (svg.includes('viewBox')) {
    svg = svg.slice(svg.indexOf('>') + 1)
    svg = svg.replace('</svg>', '')
  }
  return svg
}

function readSvg (name) {
  return stripSvg(fs.readFileSync(`./svgs/svgItems/${name}.svg`, 'utf8'))
}
function setupSvg (...svgData) {
  const svgTypesAndSizes = Array()
  const svgs = Array()
  for (const [svgType, svg] of svgData) {
    svgs.push(svg.join(''))
    svgTypesAndSizes.push([ethers.utils.formatBytes32String(svgType), svg.map(value => value.length)])
  }
  return [svgs.join(''), svgTypesAndSizes]
}

function setupSvgUpdate (...svgData) {
  const svgTypesAndIdsAndSizes = Array()
  const svgs = Array()
  for (const [itemType, svgItems] of svgData) {
    const svg = svgItems.map(value => value.svg)
    const ids = svgItems.map(value => value.id)
    svgs.push(svg.join(''))
    svgTypesAndIdsAndSizes.push([ethers.utils.formatBytes32String(itemType), ids, svg.map(value => value.length)])
  }
  return [svgs.join(''), svgTypesAndIdsAndSizes]
}

function bodyEquippable (name) {
  let svg = readSvg(name)
  console.log(name, svg.length)
  bodyEquippables.push({ id: name.slice(0, name.indexOf('_')), svg: svg })
  const leftSleevesUp = '<g class="tokentxr-sleeves tokentxr-sleeves-left tokentxr-sleeves-up">' + readSvg(`${name}LeftUp`) + '</g>'
  const leftSleeves = '<g class="tokentxr-sleeves tokentxr-sleeves-left tokentxr-sleeves-down">' + readSvg(`${name}Left`) + '</g>'
  const rightSleevesUp = '<g class="tokentxr-sleeves tokentxr-sleeves-right tokentxr-sleeves-up">' + readSvg(`${name}RightUp`) + '</g>'
  const rightSleeves = '<g class="tokentxr-sleeves tokentxr-sleeves-right tokentxr-sleeves-down">' + readSvg(`${name}Right`) + '</g>'
  svg = '<g>' + leftSleevesUp + leftSleeves + rightSleevesUp + rightSleeves + '</g>'
  sleeves.push({ id: name.slice(0, name.indexOf('_')), svg: svg })
}

async function main () {
  console.log(sleeves)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error)
    process.exit(1)
  })

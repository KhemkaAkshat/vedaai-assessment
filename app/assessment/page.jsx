import AssessmentWorkspace from "@/components/AssessmentWorkspace";

import React from "react";

// Test-only route: keep the assessment fixture local so refreshes do not
// trigger PDF extraction or consume Gemini quota.
export const dynamic = "force-static";

function page() {
  const answers = [
    {
      questionNumber: "Q.1",
      answerText: "(B) Calcium and Magnesium",
      pages: [2],
      regions: [
        {
          page: 2,
          type: "handwritten",
          x: 61,
          y: 240,
          width: 393,
          height: 38,
          description: "Student's answer for Q.1",
        },
      ],
      hasDiagram: false,
    },
    {
      questionNumber: "Q.2",
      answerText: "(A) Mg : O -> Mg2+ [:O: 2-]",
      pages: [2],
      regions: [
        {
          page: 2,
          type: "handwritten",
          x: 64,
          y: 308,
          width: 421,
          height: 61,
          description:
            "Student's answer for Q.2 with chemical equation electron dot notation",
        },
      ],
      hasDiagram: false,
    },
    {
      questionNumber: "Q.3",
      answerText:
        "(C) It has weak electrostatic forces of attraction between its oppositely charged ions",
      pages: [2],
      regions: [
        {
          page: 2,
          type: "handwritten",
          x: 62,
          y: 412,
          width: 738,
          height: 81,
          description: "Student's answer for Q.3",
        },
      ],
      hasDiagram: false,
    },
    {
      questionNumber: "Q.4",
      answerText: "(A) Salt and water is formed",
      pages: [2],
      regions: [
        {
          page: 2,
          type: "handwritten",
          x: 58,
          y: 540,
          width: 461,
          height: 38,
          description: "Student's answer for Q.4",
        },
      ],
      hasDiagram: false,
    },
    {
      questionNumber: "Q.5",
      answerText: "(B) 5",
      pages: [2],
      regions: [
        {
          page: 2,
          type: "handwritten",
          x: 52,
          y: 624,
          width: 126,
          height: 39,
          description: "Student's answer for Q.5",
        },
      ],
      hasDiagram: false,
    },
    {
      questionNumber: "Q.6",
      answerText: "(B) Al2O3 and MgO",
      pages: [2],
      regions: [
        {
          page: 2,
          type: "handwritten",
          x: 48,
          y: 709,
          width: 321,
          height: 55,
          description: "Student's answer for Q.6",
        },
      ],
      hasDiagram: false,
    },
    {
      questionNumber: "Q.7",
      answerText: "(D) 1:8",
      pages: [2],
      regions: [
        {
          page: 2,
          type: "handwritten",
          x: 48,
          y: 792,
          width: 178,
          height: 36,
          description: "Student's answer for Q.7",
        },
      ],
      hasDiagram: false,
    },
    {
      questionNumber: "Q.8",
      answerText: "(D) Cytoplasm and Oxygen deficient muscle cells",
      pages: [2],
      regions: [
        {
          page: 2,
          type: "handwritten",
          x: 42,
          y: 875,
          width: 792,
          height: 45,
          description: "Student's answer for Q.8",
        },
      ],
      hasDiagram: false,
    },
    {
      questionNumber: "Q.9",
      answerText: "(C) 100% round and yellow",
      pages: [3],
      regions: [
        {
          page: 3,
          type: "handwritten",
          x: 105,
          y: 208,
          width: 435,
          height: 45,
          description: "Student's answer for Q.9",
        },
      ],
      hasDiagram: false,
    },
    {
      questionNumber: "Q.10",
      answerText: "(C) (i) and (iii)",
      pages: [3],
      regions: [
        {
          page: 3,
          type: "handwritten",
          x: 103,
          y: 290,
          width: 293,
          height: 40,
          description: "Student's answer for Q.10",
        },
      ],
      hasDiagram: false,
    },
    {
      questionNumber: "Q.11",
      answerText: "(D) Auxins",
      pages: [3],
      regions: [
        {
          page: 3,
          type: "handwritten",
          x: 107,
          y: 381,
          width: 198,
          height: 37,
          description: "Student's answer for Q.11",
        },
      ],
      hasDiagram: false,
    },
    {
      questionNumber: "Q.12",
      answerText: "(C) Starch into simple sugars",
      pages: [3],
      regions: [
        {
          page: 3,
          type: "handwritten",
          x: 102,
          y: 465,
          width: 479,
          height: 43,
          description: "Student's answer for Q.12",
        },
      ],
      hasDiagram: false,
    },
    {
      questionNumber: "Q.13",
      answerText: "(D) 99%",
      pages: [3],
      regions: [
        {
          page: 3,
          type: "handwritten",
          x: 103,
          y: 546,
          width: 182,
          height: 40,
          description: "Student's answer for Q.13",
        },
      ],
      hasDiagram: false,
    },
    {
      questionNumber: "Q.14",
      answerText: "(D) (ii) and (iv)",
      pages: [3],
      regions: [
        {
          page: 3,
          type: "handwritten",
          x: 102,
          y: 632,
          width: 297,
          height: 40,
          description: "Student's answer for Q.14",
        },
      ],
      hasDiagram: false,
    },
    {
      questionNumber: "Q.15",
      answerText: "(A) scattering of light",
      pages: [3],
      regions: [
        {
          page: 3,
          type: "handwritten",
          x: 103,
          y: 718,
          width: 378,
          height: 46,
          description: "Student's answer for Q.15",
        },
      ],
      hasDiagram: false,
    },
    {
      questionNumber: "Q.16",
      answerText: "(A) (i) and (ii)",
      pages: [3],
      regions: [
        {
          page: 3,
          type: "handwritten",
          x: 106,
          y: 804,
          width: 278,
          height: 38,
          description: "Student's answer for Q.16",
        },
      ],
      hasDiagram: false,
    },
    {
      questionNumber: "Q.17",
      answerText:
        "(B) Both Assertion(A) and Reason(R) are true, but Reason (R) is not the correct explaination of (A).",
      pages: [3],
      regions: [
        {
          page: 3,
          type: "handwritten",
          x: 106,
          y: 883,
          width: 799,
          height: 78,
          description: "Student's answer for Q.17",
        },
      ],
      hasDiagram: false,
    },
    {
      questionNumber: "Q.18",
      answerText:
        "(A) Both Assertion (A) and Reason (R) are true and Reason (R) is the correct explaination of Assertion (A)",
      pages: [4],
      regions: [
        {
          page: 4,
          type: "handwritten",
          x: 52,
          y: 204,
          width: 816,
          height: 79,
          description: "Student's answer for Q.18",
        },
      ],
      hasDiagram: false,
    },
    {
      questionNumber: "Q.19",
      answerText: "(C) Assertion (A) is true, but Reason (R) is false.",
      pages: [4],
      regions: [
        {
          page: 4,
          type: "handwritten",
          x: 52,
          y: 329,
          width: 708,
          height: 48,
          description: "Student's answer for Q.19",
        },
      ],
      hasDiagram: false,
    },
    {
      questionNumber: "Q.20",
      answerText:
        "(B) Both Assertion (A) and Reason (R) are true, but Reason (R) is not the correct explaination of Assertion (A)",
      pages: [4],
      regions: [
        {
          page: 4,
          type: "handwritten",
          x: 48,
          y: 415,
          width: 772,
          height: 117,
          description: "Student's answer for Q.20",
        },
      ],
      hasDiagram: false,
    },
    {
      questionNumber: "Q.21",
      answerText:
        "Given -\nu = -10 cm (object distance)\nf = -15 cm (Since it is a concave mirror)\nTo find -> v (image distance)\n=> Mirror formula = 1/v + 1/u = 1/f\n1/v - 1/10 = -1/15\n1/v = -1/15 + 1/10\n1/v = (-10 + 15) / (10 x 15)\n1/v = 5 / (10 x 15)\nv = +30cm\nPosition of image formed by mirror = +30cm on the other side of mirror.",
      pages: [4, 5],
      regions: [
        {
          page: 4,
          type: "handwritten",
          x: 44,
          y: 711,
          width: 571,
          height: 236,
          description: "Student's answer for Q.21 given values and formula",
        },
        {
          page: 5,
          type: "handwritten",
          x: 130,
          y: 218,
          width: 754,
          height: 542,
          description: "Student's answer for Q.21 calculation and final result",
        },
      ],
      hasDiagram: false,
    },
    {
      questionNumber: "Q.22",
      answerText:
        "(a) Lamp A ->\nPower = 50 W\nVolt = 220 V\nWe know, P = V^2 / R => R = V^2 / P\nRA = (220 x 220) / 50 = 44 x 22 = 968 Ohm\n\nLamp B ->\nPower = 25 W\nVolt = 220 V\nP = V^2 / R\nRB = (220 x 220) / 25 = 1936 Ohm\n\n.: RA / RB = 968 / 1936\nRA : RB = 1 : 2",
      pages: [5, 6, 7],
      regions: [
        {
          page: 5,
          type: "handwritten",
          x: 121,
          y: 807,
          width: 272,
          height: 160,
          description: "Lamp A given parameters",
        },
        {
          page: 6,
          type: "handwritten",
          x: 126,
          y: 215,
          width: 319,
          height: 745,
          description: "Calculations for Lamp A and Lamp B resistance",
        },
        {
          page: 7,
          type: "handwritten",
          x: 178,
          y: 170,
          width: 218,
          height: 172,
          description: "Ratio of resistances calculation",
        },
      ],
      hasDiagram: false,
    },
    {
      questionNumber: "Q.23",
      answerText:
        "Hydra reproduces by the process of budding. With help of regenerative cells, there is outgrowth called bud which develops.\n[Diagram showing stages of Budding in Hydra: Parent Hydra -> Small outgrowth (bud) -> Tentacle / fully grown bud detaches]",
      pages: [7],
      regions: [
        {
          page: 7,
          type: "handwritten",
          x: 111,
          y: 427,
          width: 750,
          height: 125,
          description: "Explanation of budding in Hydra",
        },
        {
          page: 7,
          type: "diagram",
          x: 174,
          y: 574,
          width: 732,
          height: 393,
          description: "Diagram depicting budding stages in Hydra",
        },
      ],
      hasDiagram: true,
    },
    {
      questionNumber: "Q.24",
      answerText:
        "(b)(i) The transport system in plants is relatively slower than in animals because plants are mainly composed of dead cells. Plants are stationary and don't require energy to perform activities when compared to animals/humans. Moreover, simple processes like diffusion and osmosis help in transport of materials from soil. They have vascular tissues like xylem and phloem, humans/animals have specialised cells.\n(ii) Phloem is a vascular tissue mainly composed of living cells. It helps in translocation of food. This means to transport soluble products of photosynthesis, amino acids and hormones in plants. The flow is bidirectional. Materials like sucrose is transported by using energy from ATP for eg. During spring, food stored in stem and roots is transported to buds.",
      pages: [8, 9],
      regions: [
        {
          page: 8,
          type: "handwritten",
          x: 51,
          y: 208,
          width: 788,
          height: 757,
          description: "Answer parts (b)(i) and (ii)",
        },
        {
          page: 9,
          type: "handwritten",
          x: 172,
          y: 205,
          width: 471,
          height: 38,
          description: "Continuation of part (ii) on page 9",
        },
      ],
      hasDiagram: false,
    },
    {
      questionNumber: "Q.25",
      answerText:
        "For a chemical change to occur there has to be:\ni) evolution of gas\nii) change in temperature\niii) change in odour\niv) formation of precipitate\n\nHere,\nZn + H2SO4 -> ZnSO4 + H2^\n\nHere 2 observations are seen -\ni) Evolution of gas (H2)\nii) Change in temperature / since this is an exothermic reaction.",
      pages: [9],
      regions: [
        {
          page: 9,
          type: "handwritten",
          x: 110,
          y: 293,
          width: 777,
          height: 546,
          description:
            "Student's answer for Q.25 with criteria and chemical equation",
        },
      ],
      hasDiagram: false,
    },
    {
      questionNumber: "Q.26",
      answerText:
        "(a) 2HNO3 + Ca(OH)2 -> Ca(NO3)2 + 2H2O\n(b) NaCl + AgNO3 -> AgCl + NaNO3",
      pages: [10],
      regions: [
        {
          page: 10,
          type: "handwritten",
          x: 67,
          y: 202,
          width: 639,
          height: 172,
          description: "Balanced chemical equations for Q.26",
        },
      ],
      hasDiagram: false,
    },
    {
      questionNumber: "Q.27",
      answerText:
        "(a) When 1 Joule of work is done to move 1 Coulomb of charge from one point to another in an electric field, it is said to be 1 Volt.\nV = W / Q\n1V = 1J / 1C\n1V = 1 J C^-1\n\n(b) [Circuit Diagram]\nLet R1 = 5 Ohm, R2 = 10 Ohm\nTo find -> I (current)\nTotal resistance (Rs) = R1 + R2 = 5 + 10 = 15 Ohm\nI = V / R (Ohm's law) = 1.5 / 15 = 0.1 A",
      pages: [10, 11],
      regions: [
        {
          page: 10,
          type: "handwritten",
          x: 48,
          y: 490,
          width: 761,
          height: 418,
          description: "Definition of 1 Volt and formula",
        },
        {
          page: 11,
          type: "diagram",
          x: 218,
          y: 235,
          width: 313,
          height: 242,
          description: "Circuit diagram drawn for part (b)",
        },
        {
          page: 11,
          type: "handwritten",
          x: 107,
          y: 551,
          width: 472,
          height: 415,
          description: "Current calculation for part (b)",
        },
      ],
      hasDiagram: true,
    },
    {
      questionNumber: "Q.28",
      answerText:
        "In the given circuit,\nLet R1 = 10 Ohm, R2 = 15 Ohm, R3 = 60 Ohm, R4 = 40 Ohm\n[Circuit Diagram]\n\n(a) Since R1 and R2 are in parallel,\n1/R1 + 1/R2 = 1/R5\n1/10 + 1/15 = 1/R5\n(15+10)/150 = 1/R5\nR5 = 6 Ohm\nNow R3 and R4 are in parallel,\n1/R3 + 1/R4 = 1/R6\n1/60 + 1/40 = 1/R6\n100 / (60 x 40) = 1/R6\n.: R6 = 24 Ohm\nNow total Rs = R5 + R6 = 30 Ohm -> Total resistance\n\n(b) Total current ->\nR = 30 Ohm, V = 15 V\nI = V / R (Ohm's law) = 1/2 A\n\n(c) Total Resistance (R5) of parallel combination of 10 Ohm and 15 Ohm = 6 Ohm\nI = 1/2 A\n.: V = I R (Ohm's law) = 3V\nVoltage across them is 3V",
      pages: [12, 13, 14],
      regions: [
        {
          page: 12,
          type: "diagram",
          x: 150,
          y: 140,
          width: 390,
          height: 395,
          description: "Circuit diagram drawn for Q.28",
        },
        {
          page: 12,
          type: "handwritten",
          x: 78,
          y: 542,
          width: 595,
          height: 420,
          description: "Part (a) setup and initial parallel calculation",
        },
        {
          page: 13,
          type: "handwritten",
          x: 125,
          y: 204,
          width: 719,
          height: 758,
          description:
            "Completion of total resistance calculation for part (a)",
        },
        {
          page: 14,
          type: "handwritten",
          x: 80,
          y: 208,
          width: 722,
          height: 632,
          description: "Calculations for parts (b) and (c)",
        },
      ],
      hasDiagram: true,
    },
    {
      questionNumber: "Q.29",
      answerText:
        "(i) [Ray diagram for convex mirror with object at infinity]\nPosition of object -> At infinity\nNature of image -> virtual, erect, diminished, At focus on other side\n\n(ii) [Ray diagram for convex mirror with object between infinity and pole]\nPosition of object -> Between infinity and Pole\nNature of image -> Virtual, Erect, diminished, between F and P on other side",
      pages: [15],
      regions: [
        {
          page: 15,
          type: "diagram",
          x: 172,
          y: 130,
          width: 498,
          height: 348,
          description: "Ray diagram for object at infinity",
        },
        {
          page: 15,
          type: "handwritten",
          x: 185,
          y: 518,
          width: 697,
          height: 113,
          description: "Position and nature of image for part (i)",
        },
        {
          page: 15,
          type: "diagram",
          x: 312,
          y: 702,
          width: 328,
          height: 268,
          description: "Ray diagram for object between infinity and pole",
        },
        {
          page: 15,
          type: "handwritten",
          x: 645,
          y: 685,
          width: 237,
          height: 308,
          description: "Position and nature of image for part (ii)",
        },
      ],
      hasDiagram: true,
    },
    {
      questionNumber: "Q.30",
      answerText:
        "(a) There are total 23 pairs of chromosomes present in humans or 46 chromosomes are present.\nOut of them only 1 pair of chromosomes or only 2 chromosomes are sex chromosomes.\nIn male -> X Y\nIn female -> X X\n\n(b)(i) In sexually reproducing organisms, the number of chromosomes is maintained due to inheritance of equal number of chromosomes from both the parents.\n(ii) In humans, there are 22 pair of autosomes and 1 pair of sex chromosome. In male-XY and female XX.\n(iii) The gametes have only half the amount of DNA/chromosomes present in them.\n(iv) Hence, when these two male and female gamete combine during fertilisation, original number of chromosomes is attained.\n(v) A diploid zygote is formed (2n) from haploid gametes (n).",
      pages: [16, 17],
      regions: [
        {
          page: 16,
          type: "handwritten",
          x: 68,
          y: 204,
          width: 792,
          height: 730,
          description: "Part (a) and part (b)(i)-(ii)",
        },
        {
          page: 17,
          type: "handwritten",
          x: 118,
          y: 172,
          width: 788,
          height: 332,
          description: "Part (b)(iii)-(v)",
        },
      ],
      hasDiagram: false,
    },
    {
      questionNumber: "Q.31",
      answerText:
        "(a) The hormone 'x' is adrenaline and the gland that secretes them is adrenal glands\n(b) Adrenaline hormone prepares the body for fight or flight. There are 3 main process that take place ->\ni) It increases the heart rate\nii) It decreases blood supply to skin and digestive system due to contraction of muscles around small arteries in these organs and diverts blood to skeletal muscles.\niii) It increases breathing rate due to contraction of rib cage and diaphragm.",
      pages: [17, 18],
      regions: [
        {
          page: 17,
          type: "handwritten",
          x: 136,
          y: 558,
          width: 765,
          height: 412,
          description: "Part (a) and part (b)(i)-(ii)",
        },
        {
          page: 18,
          type: "handwritten",
          x: 131,
          y: 208,
          width: 700,
          height: 162,
          description: "Part (b)(ii) continuation and part (b)(iii)",
        },
      ],
      hasDiagram: false,
    },
    {
      questionNumber: "Q.32",
      answerText:
        "(a) Aim - To show iron articles get rusted only under specific conditions of moisture and air.\nMaterials required - Iron nails, three testtube, calcium chloride, water, oil.\nProcedure -\n(a) Take three test tubes A, B and C\n(b) In test tube A, pour some water and put iron nails in it and cork it.\n(c) In test tube B, put iron nails in boiled distilled water and on top a layer of oil and cork it\n(d) In test tube C, put calcium chloride along with iron nails and cork it\n(e) Do the experimental set up as shown below ->\n[Diagram showing experimental setup with test tubes A, B, C]\n\nObservation -\ni) In test tube A, iron nails develop red-brown flaky substance (rust)\nii) In test tube B and C no rust is observed as in test tube B boiled distilled water and layer of oil prevent air to interact with iron nail. In test tube C, calcium chloride absorbs all the moisture present.\n\nConclusion -\nFor iron to get rusted both moisture and air contact is necessary.",
      pages: [18, 19, 20],
      regions: [
        {
          page: 18,
          type: "handwritten",
          x: 48,
          y: 410,
          width: 748,
          height: 512,
          description: "Aim, Materials, and Procedure steps (a)-(b)",
        },
        {
          page: 19,
          type: "handwritten",
          x: 128,
          y: 208,
          width: 765,
          height: 290,
          description: "Procedure steps (c)-(e)",
        },
        {
          page: 19,
          type: "diagram",
          x: 218,
          y: 515,
          width: 622,
          height: 352,
          description: "Diagram of test tubes A, B, and C setup",
        },
        {
          page: 20,
          type: "handwritten",
          x: 78,
          y: 158,
          width: 772,
          height: 598,
          description: "Observations and Conclusion",
        },
      ],
      hasDiagram: true,
    },
    {
      questionNumber: "Q.33",
      answerText:
        "(a) Displacement reactions in which a high reactive metal displaces less reactive metal from its salt soln can be used to obtain two metals from middle of reactivity series -> Manganese and Iron\n(I) Reach of Aluminium with manganese oxide -\nHere Al being more reactive displaces Mn.\n4Al + 3MnO2 -> 2Al2O3 + 3Mn + heat\nThe heat evolved is so large that Mn is obtained in molten form\n(II) Reach of ferric oxide with aluminium to obtain Iron ->\nHere Al replaces iron from its oxide.\nFe2O3 + 2Al -> Fe + Al2O3 + heat\n-> This is also known as thermit reaction.\n\n(b) Metals high up in the reactivity series cannot be obtained by reduction of oxides by carbon as -\n(i) These metals (K, Na, Ca) are highly reactive\n(ii) They have more affinity for oxygen rather than carbon.",
      pages: [21, 22],
      regions: [
        {
          page: 21,
          type: "handwritten",
          x: 118,
          y: 208,
          width: 788,
          height: 772,
          description: "Part (a) explanations and equations",
        },
        {
          page: 22,
          type: "handwritten",
          x: 72,
          y: 204,
          width: 765,
          height: 285,
          description: "Part (b) reasons",
        },
      ],
      hasDiagram: false,
    },
    {
      questionNumber: "Q.34",
      answerText:
        "(b)(i) [Ray diagram for refraction through rectangular glass slab]\nHere,\nAB -> incident ray\n∠ABM -> angle of incidence\n∠NBC -> angle of refraction\nBC -> refracted ray\n∠QCP -> angle of emergence\nCP -> emergent ray\nd -> lateral displacement\n\n(ii) Snell's law of refraction of light ->\nThe ratio of sine of angle of incidence to the sine of angle of refraction is constant for a given colour and given pair of media. (i, r < 90°)\nsin i / sin r = constant\nThis constant is known as refractive index of medium 2 with respect to medium 1.\n\n(iii) Aspect | Virtual image by convex lens | Virtual image by concave lens\n(I) Object distance | Between Focus and Optical centre | Anywhere from infinity to optical centre\n(II) Magnification | Greater than 1 (Image is enlarged) | Less than 1 (Image is diminished)",
      pages: [22, 23],
      regions: [
        {
          page: 22,
          type: "diagram",
          x: 122,
          y: 660,
          width: 242,
          height: 305,
          description: "Refraction diagram through glass slab",
        },
        {
          page: 22,
          type: "handwritten",
          x: 412,
          y: 678,
          width: 418,
          height: 318,
          description: "Labels and definitions for refraction diagram",
        },
        {
          page: 23,
          type: "handwritten",
          x: 128,
          y: 202,
          width: 761,
          height: 338,
          description: "Part (ii) Snell's law",
        },
        {
          page: 23,
          type: "handwritten",
          x: 115,
          y: 592,
          width: 792,
          height: 368,
          description: "Part (iii) comparison table",
        },
      ],
      hasDiagram: true,
    },
    {
      questionNumber: "Q.35",
      answerText:
        "(i) (I) Ovary -> Produces female gametes, eggs which take part in the process of fertilisation.\n(II) Fallopian tube -> It is the site of fertilisation of female gamete (egg) and male gamete (sperm).\n(III) Uterus -> Provides nutrients for nourishment of foetus. It has thick and spongy lining which provides necessary conditions if egg is fertilised. During pregnancy, Placenta develops which helps to provide nutrients from mother's body and removal of waste from body of foetus.\n\n(ii) Two contraceptive methods used by males ->\n(a) Mechanical barriers - condoms\n-> These help to prevent sperm transfer to female body and prevents transmission of STD's (Sexually transmitted diseases)\n(b) Surgical method -> Vasectomy\n-> In this the vas deferens of male is blocked, which prevents sperm transfer.",
      pages: [24, 25],
      regions: [
        {
          page: 24,
          type: "handwritten",
          x: 51,
          y: 192,
          width: 788,
          height: 765,
          description:
            "Part (i) functions of female reproductive system organs",
        },
        {
          page: 25,
          type: "handwritten",
          x: 106,
          y: 218,
          width: 788,
          height: 418,
          description: "Part (ii) male contraceptive methods",
        },
      ],
      hasDiagram: false,
    },
    {
      questionNumber: "Q.36",
      answerText:
        "(b)(i) Carbon forms compounds mainly by covalent bonding because -\nCarbon is tetravalent (2,4). It either has to gain or lose e-. Hence it forms covalent bonding by sharing of e-.\n(a) If carbon loses 4e- to form C4+ cation, then it will be difficult for nucleus to hold on to 2e- with 6p+. A lot of energy will be lost.\n(b) If carbon gains 4e- to form C4- anion, then the nucleus will have 10e- with just 6p+ which is unstable. This process also requires a lot of energy.\nHence carbon forms compounds by covalent bonding as there are also other properties which allow it to do so like catenation, tetravalency and small size.\n\n(ii) Covalent compounds have low melting and boiling point as they have weak intermolecular forces of attraction which can easily be overcome due to heat.\n\n(iii)(I) Covalent compounds don't have any free electrons, they only constitute of shared pair of electrons. Hence they are bad conductors of electricity.\n(II) Carbon shows self-linkage property of forming long chain of carbon atoms. It forms saturated, unsaturated compounds. It can even form branched, cyclic chains. Due to its tetravalency, it forms bonds with other carbon atoms.",
      pages: [25, 26, 27],
      regions: [
        {
          page: 25,
          type: "handwritten",
          x: 105,
          y: 762,
          width: 703,
          height: 128,
          description: "Part (b)(i) introductory text",
        },
        {
          page: 26,
          type: "handwritten",
          x: 71,
          y: 208,
          width: 765,
          height: 718,
          description: "Part (b)(i) sub-parts (a) and (b)",
        },
        {
          page: 27,
          type: "handwritten",
          x: 108,
          y: 218,
          width: 782,
          height: 715,
          description: "Part (ii) and part (iii)(I)-(II)",
        },
      ],
      hasDiagram: false,
    },
    {
      questionNumber: "Q.37",
      answerText:
        "(a) Wire | Insulation cover\nLive wire | Red\nNeutral wire | Black\nEarth wire | Green\n\n(b) Given ->\nP = 1000 W\nV = 220 V\nTo find -> I\n=> P = V I\n=> I = P / V = 1000 / 220 = 4.5 A\nHence current rating should be at least 5A.\n\n(c)(i) Earth wire is connected to the metallic body of appliances to prevent overflow of current in a circuit and to prevent fatal accidents and damaging of appliance. The earth wire is connected to a metal plate buried inside earth. Whenever there is an excess of current flowing through circuit, it offers low resistance path for current to flow in earth, therefore saving appliances such as electric iron from damage and prevent overloading / breaking of circuit.",
      pages: [28, 29],
      regions: [
        {
          page: 28,
          type: "handwritten",
          x: 42,
          y: 242,
          width: 500,
          height: 260,
          description: "Part (a) table",
        },
        {
          page: 28,
          type: "handwritten",
          x: 67,
          y: 542,
          width: 761,
          height: 450,
          description: "Part (b) calculation",
        },
        {
          page: 29,
          type: "handwritten",
          x: 108,
          y: 172,
          width: 782,
          height: 542,
          description: "Part (c)(i) explanation",
        },
      ],
      hasDiagram: false,
    },
    {
      questionNumber: "Q.38",
      answerText:
        "(a) 2NaCl + 2H2O --electrolysis--> 2NaOH + H2 + Cl2\n(Caustic Soda) (Hydrogen) (Chlorine)\n\n(b) Products obtained | Uses\ni) H2 (Hydrogen) | fuels, ammonia for fertilisers, margarine\nii) NaOH (Caustic soda) | De-greasing metal, soap and detergent, artificial paper making\niii) Cl2 (Chlorine) | PVCs, disinfectant, swimming pool\n\n(c)(i) Water of crystallisation -\nFixed no. of water molecules present in one formula unit of salt.\ne.g. (1) Washing soda -> Na2CO3.10H2O (Sodium carbonate decahydrate)\n(ii) CuSO4.5H2O (Copper sulphate)\n(iii) FeSO4.7H2O (Ferrous sulphate)",
      pages: [29, 30, 31],
      regions: [
        {
          page: 29,
          type: "handwritten",
          x: 108,
          y: 765,
          width: 782,
          height: 142,
          description: "Part (a) chlor-alkali reaction equation",
        },
        {
          page: 30,
          type: "handwritten",
          x: 58,
          y: 192,
          width: 792,
          height: 472,
          description: "Part (b) products and uses",
        },
        {
          page: 30,
          type: "handwritten",
          x: 55,
          y: 745,
          width: 762,
          height: 222,
          description: "Part (c)(i) definition and example 1",
        },
        {
          page: 31,
          type: "handwritten",
          x: 175,
          y: 162,
          width: 395,
          height: 160,
          description: "Part (c)(ii) and (iii) examples",
        },
      ],
      hasDiagram: false,
    },
    {
      questionNumber: "Q.39",
      answerText:
        "(a) Photosynthesis is the process by which green plants prepare their own food.\nPhotosynthesis is the process by which some green plants and bacteria prepare their own food by using inorganic substances like carbon dioxide and water in presence of sunlight and chlorophyll to form glucose.\n\n(b) 6CO2 + 12H2O --sunlight/chlorophyll--> C6H12O6 + 6O2 + 6H2O\n(glucose)\n\n(c)(i) In desert plants ->\n(a) Take up Carbon dioxide at night\n(b) Prepare an intermediate product\n(c) This product is acted upon by energy absorbed by chlorophyll during the day time.\n(d) After this they split water to form hydrogen and oxygen and Reduction of carbon dioxide to carbohydrates.",
      pages: [31, 32],
      regions: [
        {
          page: 31,
          type: "handwritten",
          x: 115,
          y: 372,
          width: 754,
          height: 382,
          description: "Part (a) definition",
        },
        {
          page: 31,
          type: "handwritten",
          x: 110,
          y: 782,
          width: 765,
          height: 118,
          description: "Part (b) chemical equation",
        },
        {
          page: 32,
          type: "handwritten",
          x: 65,
          y: 192,
          width: 782,
          height: 420,
          description: "Part (c)(i) steps in desert plants",
        },
      ],
      hasDiagram: false,
    },
  ];
  const questions =[
            {
                "number": "Q1",
                "text": "Two taps A and B fill a tank. Tap A takes 4 hours more than the time both taps take together; Tap B takes 9 hours more. The tank is filled by running A alone for x hours and B alone for y hours. Given y = 2x + 1, find the time taken by each tap alone and the values of x and y.",
                "order": 1,
                "hasDiagram": false,
                "marks": 5
            },
            {
                "number": "Q2",
                "text": "A father and his son have x and y coins. If the father gives the son 18, the son has twice as many as the father. If the son gives the father 12, the father has three times the son. Find x and y.",
                "order": 2,
                "hasDiagram": false,
                "marks": 5
            },
            {
                "number": "Q3",
                "text": "A fruit seller sells 15 apples and 10 oranges for ₹290, and 12 apples and 18 oranges for ₹324. If the cost of an apple is ₹x and an orange is ₹y, find x and y.",
                "order": 3,
                "hasDiagram": false,
                "marks": 5
            },
            {
                "number": "Q4",
                "text": "A man buys 5 notebooks and 3 pens for ₹190. On another day he buys 3 notebooks and 2 pens for ₹118. If a notebook costs ₹x and a pen costs ₹y, find x and y.",
                "order": 4,
                "hasDiagram": false,
                "marks": 5
            },
            {
                "number": "T1(i)",
                "text": "AB is a line segment and P is its mid-point. D and E lie on the same side of AB such that ∠BAD = ∠ABE and ∠EPA = ∠DPB. Show that ΔDAP ≅ ΔEBP.",
                "order": 5,
                "hasDiagram": true,
                "marks": 5
            },
            {
                "number": "T1(ii)",
                "text": "AB is a line segment and P is its mid-point. D and E lie on the same side of AB such that ∠BAD = ∠ABE and ∠EPA = ∠DPB. Show that AD = BE.",
                "order": 6,
                "hasDiagram": true,
                "marks": 5
            },
            {
                "number": "T2(i)",
                "text": "ΔABC and ΔDBC are isosceles triangles on the same base BC with A and D on the same side. AD meets BC at P. Show that ΔABD ≅ ΔACD.",
                "order": 7,
                "hasDiagram": true,
                "marks": 5
            },
            {
                "number": "T2(ii)",
                "text": "ΔABC and ΔDBC are isosceles triangles on the same base BC with A and D on the same side. AD meets BC at P. Show that ΔABP ≅ ΔACP.",
                "order": 8,
                "hasDiagram": true,
                "marks": 5
            },
            {
                "number": "T2(iii)",
                "text": "ΔABC and ΔDBC are isosceles triangles on the same base BC with A and D on the same side. AD meets BC at P. Show that AP bisects ∠A and ∠D.",
                "order": 9,
                "hasDiagram": true,
                "marks": 5
            },
            {
                "number": "T2(iv)",
                "text": "ΔABC and ΔDBC are isosceles triangles on the same base BC with A and D on the same side. AD meets BC at P. Show that AP is the perpendicular bisector of BC.",
                "order": 10,
                "hasDiagram": true,
                "marks": 5
            },
            {
                "number": "T3",
                "text": "Bisectors of ∠B and ∠C of isosceles triangle ABC (AB = AC) meet at O. Show that the external angle adjacent to ∠ABC equals ∠BOC.",
                "order": 11,
                "hasDiagram": false,
                "marks": 5
            },
            {
                "number": "T4",
                "text": "A point O is inside an equilateral quadrilateral ABCD such that OD = OB. Show that AO and OC lie on the same straight line.",
                "order": 12,
                "hasDiagram": true,
                "marks": 5
            },
            {
                "number": "T5",
                "text": "In ΔPQR, PQ = QR and L, M, N are mid-points of PQ, QR and RP respectively. Prove that LN = MN.",
                "order": 13,
                "hasDiagram": false,
                "marks": 5
            }
        ]
  return (
    <div>
      <AssessmentWorkspace
        questions={questions}
        answers={answers}
        answerSheet={null}
        // selectedQuestion={2}
        // onSelectQuestion={setSelectedQuestion}
      />
    </div>
  );
}

export default page;

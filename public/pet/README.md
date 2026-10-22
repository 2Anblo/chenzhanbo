# Calico companion

`calico-atlas.png` is an original AI-generated transparent sprite atlas created with the built-in ImageGen tool, based on the character preview approved in this conversation. No third-party sprite pack is included.

The 1254 × 1254 image contains four columns and four rows: idle/blink, walking left, resting, and affectionate reaction. `DesktopPet.tsx` selects frames using CSS background positions. Walking right mirrors the walking row.

Generation prompt:

> Create a production animation sprite atlas of the exact pale cream golden calico short-legged fluffy cat in the approved reference, preserving large black pupils, tiny pink nose and mouth, pale apricot and milk-tea brown asymmetric patches. Transparent background. Square canvas, exactly four equal columns and four equal rows. One entire cat per cell, consistent scale and markings, generous margins. Crisp simplified pixel-art aesthetic, limited palette. Row 1: sitting idle and blinking. Row 2: four side-view walking-left gait frames. Row 3: lying and resting with sleepy eyes and breathing. Row 4: affectionate reactions with head tilt, happy closed eyes, raised paw, and normal pose. No text, labels, dividers, floor, scenery, or accessories.

The pet runs locally without an API or animation library. Mobile starts collapsed; an explicit visibility preference is stored locally when storage is available. Hidden browser tabs pause updates and reduced-motion preferences disable automatic animation. Admin and development preview routes omit the pet. `/pet-preview` is an unindexed standalone preview that does not need database content.

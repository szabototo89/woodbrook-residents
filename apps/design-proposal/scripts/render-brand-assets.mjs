import { chromium } from '@playwright/test';
import { writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const browser = await chromium.launch();
const page = await browser.newPage();

const assets = await page.evaluate(() => {
  const rose = '#a45458';
  const paleRose = '#d7a8a6';
  const ink = '#181716';

  function canvasAsset(width, height, draw) {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext('2d');
    context.clearRect(0, 0, width, height);
    draw(context);
    return canvas.toDataURL('image/png');
  }

  function prepareIcon(context, color = rose) {
    context.scale(3, 3);
    context.strokeStyle = color;
    context.fillStyle = color;
    context.lineCap = 'round';
    context.lineJoin = 'round';
    context.lineWidth = 1.45;
  }

  function strokePath(context, draw) {
    context.beginPath();
    draw(context);
    context.stroke();
  }

  const footerRose = canvasAsset(760, 1120, (context) => {
    context.translate(2, 70);
    context.scale(4.2, 4.2);
    context.strokeStyle = paleRose;
    context.lineWidth = 1.1;
    context.lineCap = 'round';
    context.lineJoin = 'round';

    strokePath(context, (path) => {
      path.moveTo(168, 215);
      path.bezierCurveTo(150, 157, 147, 107, 166, 54);
    });
    strokePath(context, (path) => {
      path.moveTo(164, 145);
      path.bezierCurveTo(143, 134, 130, 120, 128, 101);
      path.bezierCurveTo(149, 105, 162, 119, 164, 145);
      path.closePath();
    });
    strokePath(context, (path) => {
      path.moveTo(164, 170);
      path.bezierCurveTo(145, 172, 130, 180, 119, 195);
      path.bezierCurveTo(138, 198, 153, 190, 164, 170);
      path.closePath();
    });
    strokePath(context, (path) => {
      path.moveTo(152, 97);
      path.bezierCurveTo(135, 93, 123, 83, 116, 68);
      path.bezierCurveTo(134, 66, 146, 76, 152, 97);
      path.closePath();
    });
    strokePath(context, (path) => {
      path.moveTo(116, 74);
      path.bezierCurveTo(124, 56, 138, 46, 158, 45);
      path.bezierCurveTo(156, 64, 142, 74, 116, 74);
      path.closePath();
    });
    strokePath(context, (path) => {
      path.moveTo(107, 42);
      path.bezierCurveTo(125, 23, 149, 21, 167, 38);
      path.bezierCurveTo(184, 55, 179, 79, 159, 92);
      path.bezierCurveTo(140, 105, 115, 98, 105, 77);
      path.bezierCurveTo(98, 63, 99, 52, 107, 42);
      path.closePath();
    });
    strokePath(context, (path) => {
      path.moveTo(119, 48);
      path.bezierCurveTo(135, 42, 147, 46, 155, 58);
      path.bezierCurveTo(142, 60, 131, 67, 125, 79);
      path.bezierCurveTo(117, 68, 115, 58, 119, 48);
      path.closePath();
    });
    strokePath(context, (path) => {
      path.moveTo(105, 61);
      path.bezierCurveTo(118, 59, 129, 64, 136, 76);
      path.bezierCurveTo(124, 78, 116, 84, 111, 94);
      path.bezierCurveTo(104, 83, 102, 72, 105, 61);
      path.closePath();
    });
    strokePath(context, (path) => {
      path.moveTo(153, 48);
      path.bezierCurveTo(161, 58, 162, 70, 156, 82);
      path.bezierCurveTo(150, 73, 142, 68, 131, 65);
      path.bezierCurveTo(136, 55, 143, 49, 153, 48);
      path.closePath();
    });
  });

  const booking = canvasAsset(96, 96, (context) => {
    prepareIcon(context);
    strokePath(context, (path) => {
      path.moveTo(27.5, 4.2);
      path.bezierCurveTo(16.2, 5.4, 9.1, 11.2, 6.2, 25.6);
      path.bezierCurveTo(12.4, 18.5, 18.5, 13.9, 26.1, 10.4);
    });
    strokePath(context, (path) => {
      path.moveTo(6.2, 25.6);
      path.lineTo(3.8, 29);
    });
  });

  const clock = canvasAsset(96, 96, (context) => {
    prepareIcon(context);
    context.beginPath();
    context.arc(16, 16, 10.5, 0, Math.PI * 2);
    context.stroke();
    strokePath(context, (path) => {
      path.moveTo(16, 9.5);
      path.lineTo(16, 16);
      path.lineTo(21.2, 16);
    });
  });

  const phone = canvasAsset(96, 96, (context) => {
    prepareIcon(context);
    strokePath(context, (path) => {
      path.moveTo(9.2, 4.8);
      path.lineTo(5.8, 6.5);
      path.bezierCurveTo(4.6, 7.1, 4.2, 8.5, 4.6, 9.8);
      path.bezierCurveTo(7.4, 18.2, 13.8, 24.6, 22.2, 27.4);
      path.bezierCurveTo(23.5, 27.8, 24.9, 27.4, 25.5, 26.2);
      path.lineTo(27.2, 22.8);
      path.lineTo(21.5, 19.9);
      path.lineTo(19.1, 23);
      path.bezierCurveTo(14.6, 21.1, 10.9, 17.4, 9, 12.9);
      path.lineTo(12.1, 10.5);
      path.closePath();
    });
  });

  const email = canvasAsset(96, 96, (context) => {
    prepareIcon(context);
    context.strokeRect(4.5, 7.5, 23, 17);
    strokePath(context, (path) => {
      path.moveTo(5.5, 9);
      path.lineTo(16, 17);
      path.lineTo(26.5, 9);
    });
  });

  const instagram = canvasAsset(96, 96, (context) => {
    prepareIcon(context, ink);
    context.beginPath();
    context.roundRect(4.5, 4.5, 23, 23, 6);
    context.stroke();
    context.beginPath();
    context.arc(16, 16, 5.2, 0, Math.PI * 2);
    context.stroke();
    context.beginPath();
    context.arc(23.2, 8.8, 1.3, 0, Math.PI * 2);
    context.fill();
  });

  const facebook = canvasAsset(96, 96, (context) => {
    prepareIcon(context, ink);
    context.font = '700 26px Arial';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText('f', 16, 17);
  });

  function arrow(color) {
    return canvasAsset(96, 48, (context) => {
      context.scale(3, 3);
      context.strokeStyle = color;
      context.lineWidth = 1.35;
      context.lineCap = 'round';
      context.lineJoin = 'round';
      strokePath(context, (path) => {
        path.moveTo(4, 8);
        path.lineTo(27, 8);
        path.moveTo(22.5, 3.8);
        path.lineTo(27, 8);
        path.lineTo(22.5, 12.2);
      });
    });
  }

  return {
    'footer-rose.png': footerRose,
    'icon-booking.png': booking,
    'icon-clock.png': clock,
    'icon-phone.png': phone,
    'icon-email.png': email,
    'icon-instagram.png': instagram,
    'icon-facebook.png': facebook,
    'icon-arrow-rose.png': arrow(rose),
    'icon-arrow-white.png': arrow('#ffffff'),
  };
});

for (const [filename, dataUrl] of Object.entries(assets)) {
  const outputPath = fileURLToPath(
    new URL(`../assets/${filename}`, import.meta.url),
  );
  await writeFile(outputPath, Buffer.from(dataUrl.split(',')[1], 'base64'));
}

await browser.close();

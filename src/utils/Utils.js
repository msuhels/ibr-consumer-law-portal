import resolveConfig from 'tailwindcss/resolveConfig';
import { colorCode } from './ColorCode'

export const tailwindConfig = () => {
  // Tailwind config
  return resolveConfig('./src/css/tailwind.config.js')
}

export const hexToRGB = (h) => {
  let r = 0;
  let g = 0;
  let b = 0;
  if (h.length === 4) {
    r = `0x${h[1]}${h[1]}`;
    g = `0x${h[2]}${h[2]}`;
    b = `0x${h[3]}${h[3]}`;
  } else if (h.length === 7) {
    r = `0x${h[1]}${h[2]}`;
    g = `0x${h[3]}${h[4]}`;
    b = `0x${h[5]}${h[6]}`;
  }
  return `${+r},${+g},${+b}`;
};

export const formatValue = (value) => Intl.NumberFormat('en-US', {
  maximumSignificantDigits: 3,
  notation: 'compact',
}).format(value);

export const formatThousands = (value) => Intl.NumberFormat('en-US', {
  maximumSignificantDigits: 3,
  notation: 'compact',
}).format(value);

export const  getRandomColorStaick=(i)=> {
  let colorCode = ["#172FCB","#D2691E", "#FF7F50","#CB8717" ,"#DC143C","#CB1A17", "#00FFFF", "#00008B", "#556B2F", "#2F4F4F", "#00CED1", "#FF1493", "#FFD700", "#778899", "#9370DB", "#191970", "#808000", "#8B4513","#87CEEB","#9ACD32"]
  var color = "#00FFFF";
  if(colorCode[i]){
    color =colorCode[i];
  }
  return color;
}


export const  getRandomColor=()=> {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

const getInitials = (name) => {
  let initials;
  const nameSplit = name.split(" ");
  const nameLength = nameSplit.length;
  if (nameLength > 1) {
      initials =
          nameSplit[0].substring(0, 1) +
          nameSplit[nameLength - 1].substring(0, 1);
  } else if (nameLength === 1) {
      initials = nameSplit[0].substring(0, 1);
  } else return;

  return initials.toUpperCase();
};

export const createImageFromInitials = (size, name, color) => {
  if (name == null) return;
  name=getInitials(name)

  const canvas=document.createElement('canvas')
  const context=canvas.getContext('2d')
  canvas.width=canvas.height=size

  context.fillStyle="#ffffff"
  context.fillRect(0,0,size,size)

  context.fillStyle=`${color}20`
  context.fillRect(0,0,size,size)

  context.fillStyle=color;
  context.textBaseline='middle'
  context.textAlign='center'
  context.font =`${size/2}px Roboto`
  context.fillText(name,(size/2),(size/2))

  return canvas.toDataURL()
};

import { ButtonProps } from '@/types/types';
import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
const getBgVarient=(variant: ButtonProps['bgVariant'])=>{
switch(variant){
  case "secondary":
    return "bg-gray-500";
  case "danger":
    return "bg-red-500";
  case "success":
    return "bg-green-500";
  case "outline":
    return "bg-transparent";
  default:
    return "bg-[#0286ff]"
}

}


const getTextVarient=(variant: ButtonProps['textVariant'])=>{
switch(variant){
  case "secondary":
    return "text-gray-100";
  case "danger":
    return "text-red-100";
  case "success":
    return "text-green-100";
  case "primary":
    return "text-black";
    default:
      return "text-black"
}

}
const CustomButton = ({
  onPress,
  title ,
  bgVariant="primary",
  textVariant="default",
  IconLeft,
  IconRight,
  className,
   ...props}:ButtonProps
  ) => {
  return (
    <TouchableOpacity
    onPress={onPress} 
      className={`w-full rounded-full flex flex-row p-3 justify-center items-center shadow-md shadow-neutral-400/70 ${getBgVarient(bgVariant)} ${className}`} {...props}
 >
    {IconLeft && <IconLeft/>}
      <Text className={`text-lg font-bold ${getTextVarient(textVariant)} `}>{title}</Text>
    {IconRight && <IconRight/>}
    
    
    </TouchableOpacity>
  )
}

export default CustomButton
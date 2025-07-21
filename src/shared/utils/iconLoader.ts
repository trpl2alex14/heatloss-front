export const loadIcon = async (icon: string) => {  
  const iconUrl = new URL(`../../assets/icons/${icon}`, import.meta.url)  
  return iconUrl.toString()
} 
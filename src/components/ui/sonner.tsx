import { useTheme } from "next-themes"
import { Toaster as Sonner, toast } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()
  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
       position="top-right" 
      //  closeButton={true} 
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
          //      success: "!bg-green-500 !text-white",
          // error: "!bg-red-500 !text-white",
          // warning: "!bg-yellow-500 !text-white",
          // info: "!bg-blue-500 !text-white",
// closeButton: "!absolute !left-[350px] !top-1 !bg-[#C04E2B] !size-5 !text-white hover:!border",
        },
      }}
      {...props}
    />
  )
}

export { Toaster, toast }

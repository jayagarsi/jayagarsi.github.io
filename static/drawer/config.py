
class Config:

    @staticmethod
    def dpi():
        return 150
    
    @staticmethod
    def figsize():
        return (7, 3.5)
    
    @staticmethod
    def light_theme():
        light = {
            "background": "#fdfeff",
            "surface": "#ffffff",
            "text": "#14181d",
            "text-dim": "#363b41",
            "accent": "#c97c1f"
        }
        return light

    @staticmethod
    def dark_theme():
        dark = {
            "background": "#0d1117",
            "surface": "#161b22",
            "text": "#e6e6e6",
            "text-dim": "#b5bcc4",
            "accent": "#e3a857"
        }
        return dark

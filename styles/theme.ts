import { MD3DarkTheme, configureFonts } from "react-native-paper";
const regularFont = {
  fontFamily: "InriaSans-Regular",
  fontWeight: "normal" as const,
};
const boldFont = {
  fontFamily: "InriaSans-Bold",
  fontWeight: "normal" as const,
};
const lightFont = {
  fontFamily: "InriaSans-Light",
  fontWeight: "normal" as const,
};

// 2. Creamos el config. Este es el mapa que SÍ funciona.
//    Es un Record<string, MD3Type>
const fontConfig = {
  // Copiamos las variantes por defecto y solo cambiamos la fuente
  displayLarge: { ...MD3DarkTheme.fonts.displayLarge, ...boldFont },
  displayMedium: { ...MD3DarkTheme.fonts.displayMedium, ...boldFont },
  displaySmall: { ...MD3DarkTheme.fonts.displaySmall, ...boldFont },

  headlineLarge: { ...MD3DarkTheme.fonts.headlineLarge, ...boldFont },
  headlineMedium: { ...MD3DarkTheme.fonts.headlineMedium, ...boldFont },
  headlineSmall: { ...MD3DarkTheme.fonts.headlineSmall, ...boldFont },

  titleLarge: { ...MD3DarkTheme.fonts.titleLarge, ...boldFont },
  titleMedium: { ...MD3DarkTheme.fonts.titleMedium, ...boldFont },
  titleSmall: { ...MD3DarkTheme.fonts.titleSmall, ...boldFont },

  labelLarge: { ...MD3DarkTheme.fonts.labelLarge, ...boldFont },
  labelMedium: { ...MD3DarkTheme.fonts.labelMedium, ...boldFont },
  labelSmall: { ...MD3DarkTheme.fonts.labelSmall, ...boldFont },

  bodyLarge: { ...MD3DarkTheme.fonts.bodyLarge, ...regularFont },
  bodyMedium: { ...MD3DarkTheme.fonts.bodyMedium, ...regularFont },
  bodySmall: { ...MD3DarkTheme.fonts.bodySmall, ...lightFont },
};

// 3. Creamos el tema
export const theme = {
  ...MD3DarkTheme,
  fonts: configureFonts({
    isV3: true,
    config: fontConfig,
  }),
  colors: {
    ...MD3DarkTheme.colors,
    primary: "#007BFF",
    onPrimary: "#F4F6F8", // Texto sobre el botón primario

    // 2. Color Secundario
    secondary: "#00C9A7",
    onSecondary: "#FFF", // Texto sobre el botón secundario

    // 3. Color Terciario
    tertiary: "#FF6B35",
    onTertiary: "#000", // Texto oscuro sobre el botón terciario

    // 4. Color de Error
    error: "#FF6B35", // Usamos el naranja también para errores
    onError: "#F4F6F8",

    // 5. Fondos (Background y Surface)
    background: "#1E2A38", // Fondo de la app
    surface: "#1A1F36", // Fondo de componentes (Card, Appbar, etc.)
    // (Puedes hacerlos ligeramente diferentes si quieres)

    // 6. Texto (Sobre fondos)
    onBackground: "#F4F6F8", // Texto principal sobre el fondo
    onSurface: "#F4F6F8", // Texto principal sobre las 'surfaces'

    // 7. Variantes de Texto/Bordes
    onSurfaceVariant: "#6B7280", // Color para texto secundario (labels de TextInput)
    outline: "#6B7280", // Color de bordes (botones 'outlined')
  },
};

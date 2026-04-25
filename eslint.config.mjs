// @ts-check
import next from "eslint-config-next";

/** @type {import("eslint").Linter.Config[]} */
const eslintConfig = [
  { ignores: [".next/**", "node_modules/**"] },
  ...next,
  {
    files: ["src/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          paths: [
            {
              name: "@/context/AuthContext",
              message:
                "Use the single public auth/wallet surface from '@/contexts' instead.",
            },
            {
              name: "@/contexts/AuthContext",
              message:
                "Import useAuth/AuthProvider from '@/contexts' to keep one public surface.",
            },
            {
              name: "@/contexts/WalletProvider",
              message:
                "Import useWallet/useWalletConfig/WalletProvider from '@/contexts' to keep one public surface.",
            },
          ],
        },
      ],
    },
  },
];

export default eslintConfig;

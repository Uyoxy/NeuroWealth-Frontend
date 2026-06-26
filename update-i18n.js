const fs = require('fs');
const path = require('path');

const messagesPath = path.join(__dirname, 'src/lib/i18n/messages.ts');
let content = fs.readFileSync(messagesPath, 'utf8');

const interfaceDashboard = `  dashboard: {
    realtime: {
      noEvents: string;
      simulatedStream: string;
      firesEvery: string;
      start: string;
      stop: string;
      reset: string;
      eventsFired: string;
      deltaBalance: string;
      deltaYield: string;
      deltaApy: string;
      eventLog: string;
      status: {
        live: string;
        paused: string;
        idle: string;
      };
    };
    portfolio: {
      overview: string;
      overviewDesc: string;
      themePreview: string;
      lightMode: string;
      darkMode: string;
      scenarioPreview: string;
      liveWidgets: string;
      emptyStates: string;
      loadingWidget: string;
      syncingData: string;
      source: string;
      sandbox: string;
      theme: string;
      unavailableTitle: string;
      unavailableDesc: string;
      retryWidgets: string;
      allocationTitle: string;
      allocationDesc: string;
      lines: string;
      line: string;
      emptyAllocation: string;
      loadSample: string;
      activityTitle: string;
      activityDesc: string;
      events: string;
      event: string;
      emptyActivity: string;
      noAmount: string;
    };
  };`;

const interfaceSettingsIndex = `    index: {
      title: string;
      subtitle: string;
      appearance: {
        title: string;
        themeTitle: string;
        themeDesc: string;
      };
      profile: {
        title: string;
        displayTitle: string;
        displayDesc: string;
        editAction: string;
        regionTitle: string;
        regionDesc: string;
        openAction: string;
      };
      wallet: {
        title: string;
        connectedTitle: string;
        connectedDesc: string;
        networkTitle: string;
        networkDesc: string;
      };
      notifications: {
        title: string;
        emailTitle: string;
        emailDesc: string;
        whatsappTitle: string;
        whatsappDesc: string;
      };
      security: {
        title: string;
        twoFactorTitle: string;
        twoFactorDesc: string;
        sessionTitle: string;
        sessionDesc: string;
      };
      region: {
        title: string;
        currencyTitle: string;
        currencyDesc: string;
        openAction: string;
      };
    };`;

const enDashboard = `    dashboard: {
      realtime: {
        noEvents: "No events yet — start the stream to see live updates.",
        simulatedStream: "Simulated event stream",
        firesEvery: "Fires deposits, withdrawals, and rebalances every 4–9 s",
        start: "Start",
        stop: "Stop",
        reset: "Reset",
        eventsFired: "Events fired",
        deltaBalance: "Δ Balance",
        deltaYield: "Δ Yield",
        deltaApy: "Δ APY",
        eventLog: "Event log",
        status: {
          live: "Live",
          paused: "Paused",
          idle: "Idle",
        },
      },
      portfolio: {
        overview: "NeuroWealth overview",
        overviewDesc: "Total balance, yield, APY, strategy, allocation, and recent activity in a single review surface with measurable light and dark theme parity.",
        themePreview: "Theme preview",
        lightMode: "Light mode",
        darkMode: "Dark mode",
        scenarioPreview: "Scenario preview",
        liveWidgets: "Live widgets",
        emptyStates: "Empty states",
        loadingWidget: "Loading portfolio widget state...",
        syncingData: "Syncing portfolio data",
        source: "Source",
        sandbox: "Sandbox",
        theme: "Theme",
        unavailableTitle: "Portfolio widgets unavailable",
        unavailableDesc: "The dashboard can retry once connectivity to the portfolio API is restored.",
        retryWidgets: "Retry widgets",
        allocationTitle: "Asset allocation",
        allocationDesc: "Visible deployment mix across strategy buckets and reserve capital.",
        lines: "allocation lines",
        line: "allocation line",
        emptyAllocation: "No allocation yet. Add a deposit to see deployed positions and reserve coverage.",
        loadSample: "Load sample data",
        activityTitle: "Recent activity",
        activityDesc: "Latest deposits, yield events, rebalances, and scheduled cash flows.",
        events: "events",
        event: "event",
        emptyActivity: "No recent activity yet. Deposits and rebalances will appear here as soon as they happen.",
        noAmount: "No amount",
      },
    },`;

const frDashboard = `    dashboard: {
      realtime: {
        noEvents: "Aucun événement pour le moment — démarrez le flux pour voir les mises à jour en direct.",
        simulatedStream: "Flux d'événements simulé",
        firesEvery: "Déclenche des dépôts, des retraits et des rééquilibrages toutes les 4–9 s",
        start: "Démarrer",
        stop: "Arrêter",
        reset: "Réinitialiser",
        eventsFired: "Événements déclenchés",
        deltaBalance: "Δ Solde",
        deltaYield: "Δ Rendement",
        deltaApy: "Δ APY",
        eventLog: "Journal des événements",
        status: {
          live: "En direct",
          paused: "En pause",
          idle: "Inactif",
        },
      },
      portfolio: {
        overview: "Aperçu NeuroWealth",
        overviewDesc: "Solde total, rendement, APY, stratégie, allocation et activité récente sur une seule interface d'évaluation, avec une parité mesurable entre les thèmes clair et sombre.",
        themePreview: "Aperçu du thème",
        lightMode: "Mode clair",
        darkMode: "Mode sombre",
        scenarioPreview: "Aperçu du scénario",
        liveWidgets: "Widgets en direct",
        emptyStates: "États vides",
        loadingWidget: "Chargement de l'état du widget de portefeuille...",
        syncingData: "Synchronisation des données du portefeuille",
        source: "Source",
        sandbox: "Sandbox",
        theme: "Thème",
        unavailableTitle: "Widgets de portefeuille indisponibles",
        unavailableDesc: "Le tableau de bord peut réessayer une fois la connectivité à l'API du portefeuille rétablie.",
        retryWidgets: "Réessayer les widgets",
        allocationTitle: "Allocation d'actifs",
        allocationDesc: "Répartition visible des déploiements entre les paniers de stratégie et le capital de réserve.",
        lines: "lignes d'allocation",
        line: "ligne d'allocation",
        emptyAllocation: "Aucune allocation pour le moment. Ajoutez un dépôt pour voir les positions déployées et la couverture de réserve.",
        loadSample: "Charger des données d'exemple",
        activityTitle: "Activité récente",
        activityDesc: "Derniers dépôts, événements de rendement, rééquilibrages et flux de trésorerie programmés.",
        events: "événements",
        event: "événement",
        emptyActivity: "Aucune activité récente. Les dépôts et rééquilibrages apparaîtront ici dès qu'ils se produiront.",
        noAmount: "Aucun montant",
      },
    },`;

const enSettingsIndex = `      index: {
        title: "Settings",
        subtitle: "Manage your account preferences and connected wallet.",
        appearance: {
          title: "Appearance",
          themeTitle: "Theme",
          themeDesc: "Choose between light, dark, or system preference.",
        },
        profile: {
          title: "Profile",
          displayTitle: "Display Name & Preferences",
          displayDesc: "Edit your display name, locale, timezone, and currency format.",
          editAction: "Edit profile",
          regionTitle: "Language & Region",
          regionDesc: "Change your locale and regional display settings.",
          openAction: "Open",
        },
        wallet: {
          title: "Wallet",
          connectedTitle: "Connected Wallet",
          connectedDesc: "Freighter wallet connection for signing transactions.",
          networkTitle: "Network",
          networkDesc: "Switch between Stellar Testnet and Mainnet.",
        },
        notifications: {
          title: "Notifications",
          emailTitle: "Email Alerts",
          emailDesc: "Receive email notifications for deposits, withdrawals, and rebalances.",
          whatsappTitle: "WhatsApp Notifications",
          whatsappDesc: "Get updates via WhatsApp messaging.",
        },
        security: {
          title: "Security",
          twoFactorTitle: "Two-Factor Authentication",
          twoFactorDesc: "Add an extra layer of security to your account.",
          sessionTitle: "Session Management",
          sessionDesc: "View and revoke active sessions.",
        },
        region: {
          title: "Region",
          currencyTitle: "Currency Display",
          currencyDesc: "Choose your preferred display currency (USD, EUR, GBP).",
          openAction: "Open profile",
        },
      },`;

const frSettingsIndex = `      index: {
        title: "Paramètres",
        subtitle: "Gérez les préférences de votre compte et votre portefeuille connecté.",
        appearance: {
          title: "Apparence",
          themeTitle: "Thème",
          themeDesc: "Choisissez entre clair, sombre ou préférence système.",
        },
        profile: {
          title: "Profil",
          displayTitle: "Nom d'affichage et Préférences",
          displayDesc: "Modifiez votre nom d'affichage, vos paramètres régionaux, votre fuseau horaire et le format de votre devise.",
          editAction: "Modifier le profil",
          regionTitle: "Langue et Région",
          regionDesc: "Modifiez vos paramètres régionaux et d'affichage.",
          openAction: "Ouvrir",
        },
        wallet: {
          title: "Portefeuille",
          connectedTitle: "Portefeuille connecté",
          connectedDesc: "Connexion du portefeuille Freighter pour la signature des transactions.",
          networkTitle: "Réseau",
          networkDesc: "Basculer entre Stellar Testnet et Mainnet.",
        },
        notifications: {
          title: "Notifications",
          emailTitle: "Alertes par e-mail",
          emailDesc: "Recevez des notifications par e-mail pour les dépôts, retraits et rééquilibrages.",
          whatsappTitle: "Notifications WhatsApp",
          whatsappDesc: "Recevez des mises à jour via la messagerie WhatsApp.",
        },
        security: {
          title: "Sécurité",
          twoFactorTitle: "Authentification à deux facteurs",
          twoFactorDesc: "Ajoutez une couche de sécurité supplémentaire à votre compte.",
          sessionTitle: "Gestion de session",
          sessionDesc: "Afficher et révoquer les sessions actives.",
        },
        region: {
          title: "Région",
          currencyTitle: "Affichage de la devise",
          currencyDesc: "Choisissez votre devise d'affichage préférée (USD, EUR, GBP).",
          openAction: "Ouvrir le profil",
        },
      },`;

content = content.replace('  settings: {', interfaceDashboard + '\\n  settings: {');
content = content.replace('  settings: {', '  settings: {\\n' + interfaceSettingsIndex);
content = content.replace('    settings: {', enDashboard + '\\n    settings: {');
content = content.replace('    settings: {', '    settings: {\\n' + enSettingsIndex);

let secondSettings = content.indexOf('    settings: {', content.indexOf('    settings: {') + 10);
content = content.substring(0, secondSettings) + frDashboard + '\\n' + content.substring(secondSettings);

let thirdSettings = content.indexOf('    settings: {', content.indexOf(frDashboard) + frDashboard.length);
content = content.substring(0, thirdSettings) + '    settings: {\\n' + frSettingsIndex + content.substring(thirdSettings + 15);

fs.writeFileSync(messagesPath, content, 'utf8');
console.log('updated i18n messages');

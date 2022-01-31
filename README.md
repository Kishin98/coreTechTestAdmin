### Come eseguire in locale
Entrando nella cartella, scaricare tutti i moduli npm usati con (avendo node js installato sula macchina)
```
npm i
```
Se non è installato expo-cli sulla propria macchina potrebbe esserci bisogno di fare
```
npm install -g expo-cli
```
Per eseguire l'app sarà necessario un emulatore Androi o un simulatore iOS. Oppure seguire la documentazione di expo per eseguire su un dispositivo fisico https://docs.expo.dev/guides/testing-on-devices/
Eseguire uno di questi 3 comandi per eseguire expo
```
npm run android
npm run ios
npm run web
```

### Problemi
- Lo stile non è molto curato.
- Il download dei cv non funziona correttamente, ho bisogno di comprendere più a fondo il file system dei dispositivi mobile.
- Il codice è stato scritto in un unico componente per questioni di tempo, ma con un po' di pazienza si può snellire e riordinare

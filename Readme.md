# EcoNotes

## 📖 Docs

→ Documentation can be found in the [docs](docs/docs.md) file.

## 📝 Project description

### Projekt

_Fassen Sie kurz die wichtigsten Features, die intendierte Zielgruppe und die grundlegende Motivation des Projekts
zusammen. Nennen Sie die aktuell bereits implementierten Funktionen und verlinken Sie den aktuellsten Release._

### Beschreibung & Anleitung

Nutzen Sie dazu Screenshots und/oder Videos. Verlinken Sie ein min. 60-sekündiges Demo-Video, das die Verwendung aller wichtigen Funktionen zeigt und in Form
eines Audio-Kommentars beschreibt._

Econotes ist eine personalisierte Daily Note Anwendung. Daily Note Taking ist eine Form des Journalings und die App soll den
Sie bietet zu verschiedenen Nachhaltigkeitsbereichen Templates mit To-dos/Aufgaben/Ziele, die sich der Nutzer frei zusammenstellen kann. 
Dort kann er täglich seine Gedanken/Gefühle/To-dos etc., in ein Dokument eintragen. Unsere Anwendung bietet digitales und personalisiertes 
Daily Note taking. Zusätzlich wird basierend auf vorherigen Notizen des Nutzers mithilfe von GPT-3 (OpenAI) ein personalisierter Eingabeblock erzeugt. 
Dieser enthält Vorschläge und Anregungen für den Nutzer, wie er sein aktuelles Leben nachhaltiger gestalten kann.

Beim Aufruf der Seite, kann sich der Nutzer über seine E-Mail-Adresse einloggen, oder sich registrieren, falls er noch keinen Account besitzt.
<br/>
<img src="./docs/screenshots/01 login.png" width= "600"/>
<img src="./docs/screenshots/02 register.png" width= "600"/>
<br/>
Sollte er sein Passwort vergessen haben, besteht auch die Möglichkeit sich sein Passwort zurücksetzen. Hierzu wird dem Nutzer ein Recovery-Link per Mail zugesendet.
<br/><img src="./docs/screenshots/03 reset password.png" width= "600"/>

Nach dem erstmaligen Einloggen kann sich der Nutzer sein Template aus vorgegebene Themenbereichen zusammensetzen. Ein Template besteht dabei immer genau aus 3 Blöcken.
<br/><img src="./docs/screenshots/04 1 template config.png" width= "600"/><br/>
Nachdem er sich seine 3 Prompts für sein Template ausgewählt hat, kann er bestimmen, ob die Blöcke als Bullet-Point-, Checklist- oder Freitext-Block angezeigt werden sollen.
<br/><img src="./docs/screenshots/04 2 template config.png" width= "600"/><br/>

Ist das Template konfiguriert, so kann der Nutzer gleich seinen ersten Eintrag erstellen. Mit jedem Tag, an dem sich der Nutzer einloggt, wird ein Eintrag generiert.
Hat der Nutzer mehr als 3 Einträge, so wird noch ein vierter Block generiert. Das besondere hierbei ist, dass dieser auf Basis der vorherigen Notizen generiert wird.
<br/><img src="./docs/screenshots/05 first entry.png" width= "600"/><br/>

Auf der linken seite der Anwendung befindet sich Navigationsbereich für die Einträge, die über die Zeit entstanden sind. Sie zeigen an, von wann der Eintrag stammt.
Beim Klick auf eine Kachel wird der entsprechende Eintrag geladen und kann auch nachträglich noch bearbeitet werden.
<br/><img src="./docs/screenshots/05 navigation.png" width= "600"/><br/>

Sollte sich der Nutzer mal umentscheiden, so kann er sich das Template überarbeiten. Das Menü für die Änderungen wird dabei über das Zahnrad-Icon aufgerufen. 
Die Änderungen sind dann für den nächsten Tag gültig.
<br/><img src="./docs/screenshots/04 3 template config later.png" width= "600"/><br/>

Über den Toggle Slider oben rechts, kann der Nutzer sich das Theme der Anwendung entweder im Light oder Dark Mode anzeigen lassen. Per Default, wenn noch keine Präferenz gesetzt wurde,
werden sich die Browsereinstellungen gezogen.
<br/><img src="./docs/screenshots/06 darkmode.png" width= "600"/><br/>

Über das Profil-Icon kann der Nutzer sich entweder Ausloggen, oder seine Nutzer-Einstellungen ändern.
<br/>
<img src="./docs/screenshots/07 1 profile menu.png" width= "600"/>
<img src="./docs/screenshots/07 2 acc settings.png" width= "600"/>
<br/>

### Team

_Listen Sie tabelarisch alle Teammitglieder mit Name, E-Mail-Adresse und Foto auf. Halten Sie für jedes Mitglied kurz
fest, welchen Teilbereich der Anwendung die jeweilige Person maßgeblich bearbeitet hat._

| Name               | E-Mail-Adresse                            | Github-Nutzer                                    | Foto                                   | Komponenten der Anwendung                                                                |
|--------------------|-------------------------------------------|--------------------------------------------------|----------------------------------------|------------------------------------------------------------------------------------------|
| Alexander Weichart | alexander.weichart@stud.uni-regensburg.de | [@AlexW00](https://github.com/AlexW00)           | ![Alex](./docs/team/img-alex.jpeg)     |                                                                                          |
| Brooke Pintsuk     | brooke.pintsuk@stud.uni-regensburg.de     | [@Brooke1803](https://github.com/Brooke1803)     | ![Brooke](./docs/team/img-brooke.jpeg) |                                                                                          |
| Le My Ngo          | le-my.ngo@stud.uni-regensburg.de          | [@myusome](https://github.com/myusome)           | ![My](./docs/team/img-my.jpeg)         | - Data Manager <br/> - Appwrite API Anbindung <br/>- Login Bereich <br/>- Logout Feature |
| Samuel Roeben      | samuel.roeben@stud.uni-regensburg.de      | [@samuelroeben](https://github.com/samuelroeben) | ![Samuel](./docs/team/img-samuel.jpeg) |                                                                                          |

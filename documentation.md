# Problems

PROBLEM 1  
Move
response kan skifta på vem som gjorde draget.
Om `player1` gjorde ROCK kan det komma tillbaka som att `Player2` gjorde draget och `Player1` fortfarande har null som drag.

PROBLEM 2
Game
När vi hämtar nuvarande spel så kan response har vänt på vem som är `Player1` och `Player2`.

# Uppgift

Uppgiften var att bygga spelet sten, sax, påse. Två spelare ska kunna spela emot varandra, genomföra spelet och presentera vinnaren. Applikationen skulle vara responsive och tillgänglighetsanpassad.

Nedan är reflektioner kring val jag har gjort för att göra denna uppgiften.

# Förtester

När jag läste detta "Observera att backenden körs on-demand och kan sluta svara eller ge knepiga felmeddelanden efter en stunds inaktivitet." valde jag att sätta upp de olika end-pointsen i Postman och testa spela. Vid testandet så märkte jag:

- När ett drag registreras kan res ha skiftat på vem som gjorde draget. Om vi exempelvis skickar att Player1 gör PAPER så kan response komma tillbaka som att det var Player2 som gjorde PAPER → Detta skiftet kvarstår under hela spelets gång.

Information om att servern körs på on-demand.. Jag hittade inga problem när jag testade att en spelare körde och vänta några min (1-10min), samt att båda körde sina drag och sen vänta.

# Lösning

Jag valde

# Tech & Packages

React
Jag är bekvämast i react och det ramverk jag har använt mest.

Tank Stack Query

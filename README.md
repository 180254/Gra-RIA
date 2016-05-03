Taka, że niby gra. Gra węgry/Gra Ria/Coś.  
Zasady: kliknięcie na pole zmienia kolor pola, które kliknięto, i pól sąsiadujących (bez przekątnych).  
  
<sub>Gra nie ma wpisanych plansz na stałe - generuje za każdym razem inny zestaw.  
Nie została zaimplementowana kontrola nad poziomiem trudności aktualnej planszy.  
Raz gra będzie łatwiejsza, raz trudniejsza. Zawsze jednak rozwiązywalna.</sub>   
  
<sub>Żeby ułatwić testowanie(grę), w konsoli JS wypisują się współrzędne, które należy kliknąć, aby rozwiązać planszę.  
Zapis kliknięc prowadzących do rozwiązania jest w postaci click(row,col).  
Przykładowo click(5,1) informuje, że należy kliknąć punkt znajdujący się w 5-tym wierszu i 1-wszej kolumnie.</sub>  
  
<sub>Istnieje możliwość sterowania rozmiarem planszy, ale tylko z poziomu kodu. Plik script.js:  
    var GameLevelSize = 5; // plansza NxN  
    var GameLevelClicks = 5; // ilość kliknięć w losowanym rozwiązaniu  
    var BoardGeneratorClickDistance = 3; // odległość pomiędzy losowymi kliknięciami</sub> 
  
![Gra-RIA](screenshot1.PNG?raw=true "Gra-RIA screenshot1")  
![Gra-RIA](screenshot2.PNG?raw=true "Gra-RIA screenshot2")  

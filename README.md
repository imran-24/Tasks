# rps-game
<p>It's not like the conventional Rock Paper Scissors Game. Here victory is defined as follows—half of the next moves in the circle wins, half of the previous moves in the circle lose (the semantics of the strings-moves is not important, he plays by the rules build upon the moves order the user used, even if the stone loses to scissors in its order</p>

  +-------------+------+-------+----------+------+------+------+------+
| v PC\User > | Rock | Paper | 3rd move | 4th  | 5th  | 6th  | 7th  |
+-------------+------+-------+----------+------+------+------+------+
| Rock        | Draw | Win   | Win      | Win  | Lose | Lose | Lose |
+-------------+------+-------+----------+------+------+------+------+
| Paper       | Lose | Draw  | Win      | Win  | Win  | Lose | Lose |
+-------------+------+-------+----------+------+------+------+------+
| 3rd move    | Lose | Lose  | Draw     | Win  | Win  | Win  | Lose |
+-------------+------+-------+----------+------+------+------+------+
| 4th         | Lose | Lose  | Lose     | Draw | Win  | Win  | Win  |
+-------------+------+-------+----------+------+------+------+------+
| 5th         | Win  | Lose  | Lose     | Lose | Draw | Win  | Win  |
+-------------+------+-------+----------+------+------+------+------+
| 6th         | Win  | Win   | Lose     | Lose | Lose | Draw | Win  |
+-------------+------+-------+----------+------+------+------+------+
| 7th         | Win  | Win   | Win      | Lose | Lose | Lose | Draw |
+-------------+------+-------+----------+------+------+------+------+


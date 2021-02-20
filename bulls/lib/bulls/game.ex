defmodule Bulls.Game do
  # This module doesn't do stuff,
  # it computes stuff.

  def new do
    %{
      secret: random_secret(),
      guesses: [],
      results: [],
      won: false,
      lost: false,
      warnings: "Please input 4 digits to begin"
    }
  end

  def guess(st, guess) do
    list_guess = String.graphemes(guess)
    cond do
      String.length(guess) != 4 -> %{ st | warnings: "Must input exactly 4 digits"}
      Enum.count(Enum.uniq(list_guess)) != Enum.count(list_guess) -> %{ st | warnings: "All digits must be unique"}
      Enum.member?(st.guesses, guess) -> %{st | warnings: "Repeated guess"}
      true -> case check_guess(st.secret, list_guess, 0, 0) do
             [4, 0] -> %{ st | won: true, guesses: st.guesses ++ [guess], results: st.results ++ [%{bulls: 4, cows: 0}], warnings: "Congrats! You win!"}
             [x, y] -> %{ st | lost: (Enum.count(st.guesses) >= 7), guesses: st.guesses ++ [guess], results: st.results ++ [%{bulls: x, cows: y}], warnings: ""}
           end
    end
  end
  
  def check_guess(secret, guess, bulls, cows) do
    Enum.zip(secret, guess)
    |> Enum.reduce([0,0] , fn {sec, g},[b, c] ->
      cond do
        g === sec -> [b + 1, c]
        Enum.member?(secret, g) -> [b, c + 1]
        true -> [b, c]
      end
    end
    )
  end
  
  def random_secret() do
    Enum.take_random(["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"], 4)
  end
  
  def get_warning(st) do
     cond do
        st.lost -> "Ran out of guesses"
        true -> st.warnings
     end
  end
  
  def view(st) do
    %{
      guesses: st.guesses,
      results: st.results,
      warnings: get_warning(st),
      disabled: (st.won || st.lost)
    }
  end
end

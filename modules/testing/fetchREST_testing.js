let pokemon
pokemon = await pkmFetch.getData(1, 5)
print(pokemon)

pokemon = await pkmFetch.getData(6)
print(pokemon)

pokemon = await pkmFetch.getData(1)
print(pokemon)

pokemon = await pkmFetch.getData(20)
print(pokemon)

pokemon = await pkmFetch.getData(50)
print(pokemon)

pokemon = await pkmFetch.getData(100)
print(pokemon)

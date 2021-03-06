﻿using DBAccess;
using GamesProvider.Services.DTOs;
using GamesProvider.Services.Interfaces;
using GamesProvider.Services.Mappers;
using Microsoft.EntityFrameworkCore;
using System.Linq;

namespace GamesProvider.Services
{
    public class GameService : IGameService
    {
        private GameServiceDBContext _dbContext;

        public GameService(GameServiceDBContext dbContext)
        {
            _dbContext = dbContext;
        }

        public FullGameDTO GetById(int id)
        {
            return _dbContext.GamePrices
                    .Where(gp => gp.GameId == id)
                    .Include(gp => gp.Game)
                        .ThenInclude(g => g.Images)
                    .Include(gp => gp.Platform)
                    .ToList()
                    .GroupBy(gp => gp.GameId)
                    .Select(group => GamesPricesGroupMapper.GamePricesToFullGameDTO(group))
                    .FirstOrDefault();
        }
    }
}

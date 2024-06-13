using Data.Repositories;
using Domain.Entities;
using Domain.Requests;
using Domain.Responses;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BL.Services
{
    public class ElementService : IElementService
    {
        private readonly IBaseRepository<Element> _elementRepository;

        public ElementService(IBaseRepository<Element> elementRepository)
        {
            _elementRepository = elementRepository;
        }

        public async Task<Element> GetElementById(int id)
        {
            return await _elementRepository.GetByIdAsync(id);
        }

        public async Task<List<Element>> GetAllElements()
        {
            return await _elementRepository.GetAllAsync();
        }

        public async Task CreateElement(ElementModel elem)
        {
            Element elem1 = new Element
            {
                Name = elem.Name,
                Symbol = elem.Symbol
            };
            await _elementRepository.AddAsync(elem1);
        }

        public async Task UpdateElement(int id, ElementModel elem)
        {
            Element elem1 = new Element
            {
                Name = elem.Name,
                Symbol = elem.Symbol
            };
            await _elementRepository.UpdateAsync(elem1);
        }

        public async Task DeleteElement(int id)
        {
            var elem = await _elementRepository.GetByIdAsync(id);
            if (elem != null)
            {
                await _elementRepository.DeleteAsync(elem);
            }
        }
    }
    public interface IElementService
    {
        Task<Element> GetElementById(int id);
        Task<List<Element>> GetAllElements();
        Task CreateElement(ElementModel model);
        Task UpdateElement(int id, ElementModel model);
        Task DeleteElement(int id);
    }
}

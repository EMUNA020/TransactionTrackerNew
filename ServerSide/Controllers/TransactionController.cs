using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ServerSide.Models;

namespace ServerSide.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TransactionsController : ControllerBase
    {
        private readonly TransactionContext _context;

        public TransactionsController(TransactionContext context)
        {
            _context = context;
        }

        [HttpGet("GetCategoryList")]
        public async Task<ActionResult<List<Category>>> GetCategoryList()
        {
            var categories = await _context.Categories.ToListAsync();
            return Ok(categories);
        }

        [HttpGet("GetTransactionDetails")]
        public async Task<ActionResult<List<Transactions>>> GetTransactionDetails()
        {
            var transactions = await _context.Transactions
                .Include(t => t.Category)
                .ToListAsync();

            return Ok(transactions); 
        }

        [HttpPost("AddTransactionLine")]
        public async Task<ActionResult> AddTransactionLine([FromBody] Transactions newTransaction)
        {
            try
            {
                newTransaction.CategoryId = newTransaction.Category?.Id;
                newTransaction.Category = null;
            if (newTransaction == null)
            {
                return BadRequest("Transaction data is null.");
            }
                _context.Transactions.Add(newTransaction);
                await _context.SaveChangesAsync();

                return Ok(new { message = "Transaction saved successfully." });
            }
            catch (Exception e)
            {

                throw;
            }
        }


    [HttpDelete("DeleteTransactionLine/{id}")]
        public async Task<ActionResult> DeleteTransactionLine(int id)
        {
            var transaction = await _context.Transactions.FindAsync(id);
            if (transaction == null)
            {
                return NotFound("Transaction not found.");
            }
            _context.Transactions.Remove(transaction);
            await _context.SaveChangesAsync();
            return Ok(new { message = "Transaction deleted successfully." });
        }
    }
    }

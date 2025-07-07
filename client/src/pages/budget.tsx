import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, DollarSign, TrendingUp, TrendingDown, AlertCircle } from "lucide-react";
import BudgetForm from "@/components/budget-form";
import type { BudgetItem } from "@shared/schema";

export default function Budget() {
  const [selectedItem, setSelectedItem] = useState<BudgetItem | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const { data: budgetItems = [], isLoading } = useQuery<BudgetItem[]>({
    queryKey: ["/api/budget"],
  });

  const totalBudget = budgetItems.reduce((sum, item) => sum + parseFloat(item.budgetAmount), 0);
  const totalSpent = budgetItems.reduce((sum, item) => sum + parseFloat(item.actualAmount), 0);
  const remaining = totalBudget - totalSpent;
  const spentPercentage = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;

  const categorizedItems = budgetItems.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, BudgetItem[]>);

  const handleEditItem = (item: BudgetItem) => {
    setSelectedItem(item);
    setIsFormOpen(true);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setSelectedItem(null);
  };

  return (
    <div className="min-h-screen bg-cream-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-playfair font-semibold text-gray-800 mb-2">Budget Tracker</h1>
          <p className="text-gray-600">Track your wedding expenses and stay within budget</p>
        </div>

        {/* Budget Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="wedding-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Budget</p>
                  <p className="text-2xl font-bold text-gray-800">${totalBudget.toLocaleString()}</p>
                </div>
                <DollarSign className="text-dusty-blue text-2xl" />
              </div>
            </CardContent>
          </Card>

          <Card className="wedding-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Spent</p>
                  <p className="text-2xl font-bold text-red-600">${totalSpent.toLocaleString()}</p>
                </div>
                <TrendingUp className="text-red-600 text-2xl" />
              </div>
            </CardContent>
          </Card>

          <Card className="wedding-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Remaining</p>
                  <p className={`text-2xl font-bold ${remaining >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    ${remaining.toLocaleString()}
                  </p>
                </div>
                <TrendingDown className={`text-2xl ${remaining >= 0 ? 'text-green-600' : 'text-red-600'}`} />
              </div>
            </CardContent>
          </Card>

          <Card className="wedding-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Budget Used</p>
                  <p className="text-2xl font-bold text-gray-800">{spentPercentage.toFixed(1)}%</p>
                </div>
                <AlertCircle className={`text-2xl ${spentPercentage > 100 ? 'text-red-600' : 'text-sage-green'}`} />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Budget Progress */}
        <Card className="wedding-card mb-8">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Budget Progress</h3>
              <span className="text-sm text-gray-600">
                ${totalSpent.toLocaleString()} of ${totalBudget.toLocaleString()}
              </span>
            </div>
            <Progress value={Math.min(spentPercentage, 100)} className="h-3" />
            {spentPercentage > 100 && (
              <p className="text-sm text-red-600 mt-2">
                ⚠️ You have exceeded your budget by ${Math.abs(remaining).toLocaleString()}
              </p>
            )}
          </CardContent>
        </Card>

        {/* Budget Items */}
        <Card className="wedding-card">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-playfair font-semibold text-gray-800">Budget Items</CardTitle>
              <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                <DialogTrigger asChild>
                  <Button className="wedding-btn">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Budget Item
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>
                      {selectedItem ? "Edit Budget Item" : "Add New Budget Item"}
                    </DialogTitle>
                  </DialogHeader>
                  <BudgetForm
                    item={selectedItem}
                    onClose={handleFormClose}
                  />
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">
                <p className="text-gray-600">Loading budget items...</p>
              </div>
            ) : budgetItems.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-600">No budget items added yet.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {Object.entries(categorizedItems).map(([category, items]) => {
                  const categoryBudget = items.reduce((sum, item) => sum + parseFloat(item.budgetAmount), 0);
                  const categorySpent = items.reduce((sum, item) => sum + parseFloat(item.actualAmount), 0);
                  const categoryProgress = categoryBudget > 0 ? (categorySpent / categoryBudget) * 100 : 0;

                  return (
                    <div key={category} className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="text-lg font-semibold text-gray-800 capitalize">{category}</h4>
                        <span className="text-sm text-gray-600">
                          ${categorySpent.toLocaleString()} / ${categoryBudget.toLocaleString()}
                        </span>
                      </div>
                      <Progress value={Math.min(categoryProgress, 100)} className="h-2" />
                      <div className="space-y-2">
                        {items.map((item) => (
                          <div
                            key={item.id}
                            className="flex items-center justify-between p-4 bg-warm-gray rounded-lg hover:bg-opacity-70 transition-colors cursor-pointer"
                            onClick={() => handleEditItem(item)}
                          >
                            <div>
                              <h5 className="font-medium text-gray-800">{item.description}</h5>
                              <p className="text-sm text-gray-600">
                                Budget: ${parseFloat(item.budgetAmount).toLocaleString()} | 
                                Actual: ${parseFloat(item.actualAmount).toLocaleString()}
                              </p>
                            </div>
                            <div className="flex items-center space-x-2">
                              {item.isPaid && (
                                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Paid</span>
                              )}
                              <span className={`text-sm font-medium ${
                                parseFloat(item.actualAmount) > parseFloat(item.budgetAmount) 
                                  ? 'text-red-600' 
                                  : 'text-sage-green'
                              }`}>
                                {parseFloat(item.actualAmount) > parseFloat(item.budgetAmount) ? 'Over' : 'Within'} Budget
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

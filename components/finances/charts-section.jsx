"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts"

export default function ChartsSection({ 
  monthlySpending, 
  budgetCategories, 
  formatCurrency, 
  showMonthlyChart = false 
}) {
  if (showMonthlyChart) {
    return (
      <ResponsiveContainer key="monthly-chart" width="100%" height={400}>
        <LineChart data={monthlySpending}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip formatter={(value) => formatCurrency(value)} />
          <Legend />
          <Line
            type="monotone"
            dataKey="spent"
            stroke="#ef4444"
            strokeWidth={2}
            name="Dépensé"
          />
          <Line
            type="monotone"
            dataKey="allocated"
            stroke="#3b82f6"
            strokeWidth={2}
            name="Alloué"
          />
          <Line
            type="monotone"
            dataKey="budget"
            stroke="#22c55e"
            strokeWidth={2}
            name="Budget"
          />
        </LineChart>
      </ResponsiveContainer>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* Monthly Spending Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Dépenses Mensuelles</CardTitle>
          <CardDescription>Évolution des dépenses par mois</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer key="bar-chart" width="100%" height={300}>
            <BarChart data={monthlySpending}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => formatCurrency(value)} />
              <Legend />
              <Bar dataKey="spent" fill="#ef4444" name="Dépensé" />
              <Bar dataKey="allocated" fill="#3b82f6" name="Alloué" />
              <Bar dataKey="budget" fill="#22c55e" name="Budget" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Budget Categories Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Budget par Catégorie</CardTitle>
          <CardDescription>Répartition du budget par secteur</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer key="pie-chart" width="100%" height={300}>
            <PieChart>
              <Pie
                data={budgetCategories}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="allocated"
              >
                {budgetCategories.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => formatCurrency(value)} />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
} 
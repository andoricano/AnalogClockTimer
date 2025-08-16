package com.andro.analogclocktimer

import androidx.compose.runtime.Composable
import androidx.navigation.NavController
import androidx.navigation.NavHostController
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import com.andro.analogclocktimer.ui.screen.HomeScreen

@Composable
fun NavGraph(navController: NavHostController) {
    NavHost(navController, startDestination = NavRoutes.Home) {
        composable(NavRoutes.Home) { HomeScreen(navController) }
    }
}

fun NavController.navigateToTheme() {
    navigate(NavRoutes.Theme)
}
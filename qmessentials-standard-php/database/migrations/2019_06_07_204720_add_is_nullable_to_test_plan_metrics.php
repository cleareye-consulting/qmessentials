<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddIsNullableToTestPlanMetrics extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('test_plan_metrics', function (Blueprint $table) {
            $table->boolean('is_nullable');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('test_plan_metrics', function (Blueprint $table) {
            $table->dropColumn('is_nullable');
        });
    }
}
